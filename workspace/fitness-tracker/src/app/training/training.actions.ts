import { Action } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_EXERCISES = '[Training] Set Available Exercise';
export const SET_FINISHED_EXERCISES = '[Training] Set Finished Exercise';
export const START_ACTIVE_EXERCISE = '[Training] Start Active Exercise';
export const STOP_ACTIVE_EXERCISE = '[Training] Stop Active Exercise';


export class SetAvailableExercises implements Action {
  readonly type = SET_AVAILABLE_EXERCISES;
  // we need to pass payload along with type. so payload must be public
  constructor(public payload: Exercise[]){}
}

export class SetFinishedExercises implements Action {
  readonly type = SET_FINISHED_EXERCISES;
  // we need to pass payload along with type. so payload must be public
  constructor(public payload: Exercise[]){}
}

export class StartActiveExercise implements Action {
  readonly type = START_ACTIVE_EXERCISE;
  // we need to pass payload along with type. so payload must be public
  constructor(public payload: string){}
}

export class StopActiveExercise implements Action {
  readonly type = STOP_ACTIVE_EXERCISE;
}

export type TrainingActions =
  | SetAvailableExercises
  | SetFinishedExercises
  | StartActiveExercise
  | StopActiveExercise;
