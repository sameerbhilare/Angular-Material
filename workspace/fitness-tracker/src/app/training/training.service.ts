import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, Subscription, Timestamp } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {

  // exerciseEmitter can emit data ONLY from this class
  private exerciseSubject = new Subject<Exercise>();
  // other classes which wnt to listen to changed exercise can listen to this public observable.
  exerciseChanged: Observable<Exercise> = this.exerciseSubject.asObservable();
  private runningExercise: Exercise;

  private exercisesSubject = new Subject<Exercise[]>();
  exercisesChanged: Observable<Exercise[]> = this.exercisesSubject.asObservable();
  private availableExercises: Exercise[] = [];

  // for completed and cancelled exercises
  private finishedExercisesSubject = new Subject<Exercise[]>();
  finishedExercisesChanged: Observable<Exercise[]> = this.finishedExercisesSubject.asObservable();

  // mange subscriptions to avoid errors on signout.
  firestoreSubscriptions: Subscription[] = [];

  constructor(private firestoreDB: AngularFirestore,
              private uiService: UIService) {}

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreSubscriptions.push(
      this.firestoreDB
        .collection('availableExercises')
        .snapshotChanges() // data along with meta data
        .pipe(
          // we get an array of Firestore Documents
          map(documentArr => {
            // to simulate error handling
            // throw(new Error()); // uncomment this line to test failed case

            // convert the array of documents to array of Exercise objects
            return documentArr.map(document => {
              return {
                id: document.payload.doc.id,
                name: document.payload.doc.data()['name'],
                duration: document.payload.doc.data()['duration'],
                calories: document.payload.doc.data()['calories'],
                // ...document.payload.doc.data() // we could also use this line instead of above 3 lines for name, duration and calories
              };
            });
          }))
        .subscribe((exercises: Exercise[]) => {
          this.availableExercises = exercises;
          this.exercisesSubject.next([...this.availableExercises]); // emit event
          this.uiService.loadingStateChanged.next(false);
        }, error => {
          this.availableExercises = null;
          this.exercisesSubject.next(null); // emit event
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackBar('Unable to fetch available exercises. Please try again later.', null, 5000);
        })
    );

  }

  startExercise(currentExerciseId: string) {
    this.runningExercise = this.availableExercises.find(el => el.id === currentExerciseId);
    this.exerciseSubject.next({...this.runningExercise}); // return a copy
  }

  getRunnigExercise() {
    return {...this.runningExercise};
  }

  completeExercise() {
    this.addDataToDatabase({
        ...this.runningExercise,
        date: new Date(),
        state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseSubject.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
        ...this.runningExercise,
        date: new Date(),
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseSubject.next(null);
  }

  addDataToDatabase(exercise: Exercise) {
    /**
     * if a collection (e.g. finishedExercises) doesn't exist in Firestore, it will be created.
     * collection add method eturns Promise, but we don't have to act upon it.
     */
    this.firestoreDB.collection('finishedExercises').add(exercise);
  }

  fetchCompletedOrCancelledExercises() {
    this.firestoreSubscriptions.push(
      this.firestoreDB
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          //exercises.map(exercise => exercise.date = new Date((exercise.date).seconds*1000)) // this is not recognized by ts and gives compilation issues but works
          this.finishedExercisesSubject.next(exercises);
        })
    );
  }

  cancelFirestoreSubscriptions() {
    this.firestoreSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
