import { Observable, Subject } from 'rxjs';
import { Exercise } from './exercise.model';

export class TrainingService {

  // exerciseEmitter can emit data ONLY from this class
  private exerciseEmitter = new Subject<Exercise>();

  // other classes which wnt to listen to changed exercise can listen to this public observable.
  exerciseChanged: Observable<Exercise> = this.exerciseEmitter.asObservable();

  private availableExercise: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private runningExercise: Exercise;

  private completedOrCancelledExercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availableExercise.slice(); // return a copy of array, not actual array
  }

  startExercise(currentExerciseId: string) {
    this.runningExercise = this.availableExercise.find(el => el.id === currentExerciseId);
    this.exerciseEmitter.next({...this.runningExercise}); // return a copy
  }

  getRunnigExercise() {
    return {...this.runningExercise};
  }

  completeExercise() {
    this.completedOrCancelledExercises.push({
        ...this.runningExercise,
        date: new Date(),
        state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseEmitter.next(null);
  }

  cancelExercise(progress: number) {
    this.completedOrCancelledExercises.push({
        ...this.runningExercise,
        date: new Date(),
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseEmitter.next(null);
  }

  getCompletedOrCancelledExercises() {
    return this.completedOrCancelledExercises.slice();
  }
}
