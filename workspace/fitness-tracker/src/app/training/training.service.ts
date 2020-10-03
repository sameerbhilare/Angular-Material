import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { Exercise } from './exercise.model';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from "./training.actions";
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {

  // mange subscriptions to avoid errors on signout.
  firestoreSubscriptions: Subscription[] = [];

  constructor(private firestoreDB: AngularFirestore,
              private uiService: UIService,
              private store: Store<fromTraining.State>) {}

  fetchAvailableExercises() {
    //this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
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
          this.store.dispatch(new Training.SetAvailableExercises(exercises));
          this.store.dispatch(new UI.StopLoading());
        }, error => {
          this.store.dispatch(new Training.SetAvailableExercises(null));

          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackBar('Unable to fetch available exercises. Please try again later.', null, 5000);
        })
    );

  }

  startExercise(currentExerciseId: string) {
    this.store.dispatch(new Training.StartActiveExercise(currentExerciseId));
  }

  completeExercise() {
    // take(1) because we only want one value, and not ongoing subscription
    this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
      });
      this.store.dispatch(new Training.StopActiveExercise());
    });

  }

  cancelExercise(progress: number) {
    // take(1) because we only want one value, and not ongoing subscription
    this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
          ...ex,
          date: new Date(),
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          state: 'cancelled'
      });
      this.store.dispatch(new Training.StopActiveExercise());
    });

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
          this.store.dispatch(new Training.SetFinishedExercises(exercises));
        })
    );
  }

  cancelFirestoreSubscriptions() {
    this.firestoreSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
