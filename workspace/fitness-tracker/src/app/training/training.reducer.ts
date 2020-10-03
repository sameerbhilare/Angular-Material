import { createSelector, createFeatureSelector } from "@ngrx/store";
import { Exercise } from './exercise.model';
import {
  TrainingActions,
  SET_AVAILABLE_EXERCISES,
  SET_FINISHED_EXERCISES,
  START_ACTIVE_EXERCISE,
  STOP_ACTIVE_EXERCISE,
} from './training.actions';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeExercise: Exercise;
}

// initiate state
const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeExercise: null
}

/*************************************************************************
 * NEW GLOBAL STATE
 * Training State can NOT be part of the Root applcaion State from app.reducer.
 * This is because Training module is lazily loaded. Hence does not make sense to be present at App startup.
 * NgRx will automatically copy 'old' global state from app.reducer State to 'new' global state
 */
export interface State extends fromRoot.State {
  training: TrainingState
}

// reducer is just a function which takes 2 arguments
// 1. state, 2. action to be taken on the state
export function trainingReducer(state = initialState, action: TrainingActions) {

  switch (action.type) {
    case SET_AVAILABLE_EXERCISES:
      return {
        ...state, // copy existing state
        availableExercises: action.payload // modify only desired state
      };
    case SET_FINISHED_EXERCISES:
      return {
        ...state, // copy existing state
        finishedExercises: action.payload // modify only desired state
      };
    case START_ACTIVE_EXERCISE:
      return {
        ...state, // copy existing state
        activeExercise: {...state.availableExercises.find(el => el.id === action.payload)} // modify only desired state
      };
    case STOP_ACTIVE_EXERCISE:
      return {
        ...state, // copy existing state
        activeExercise: null // modify only desired state
      };
    default:
      return state;
  }
}

// helper functions
export const getTraining = createFeatureSelector<TrainingState>('training'); // slice as mentioned in the StoreModule from TrainingModule

export const getAvailableExercise = createSelector(getTraining, (state: TrainingState) => state.availableExercises);
export const getFinishedExercise = createSelector(getTraining,(state: TrainingState) => state.finishedExercises);
export const getActiveExercise = createSelector(getTraining,(state: TrainingState) => state.activeExercise);
export const getIsOngoingExcercise = createSelector(getTraining,(state: TrainingState) => state.activeExercise != null);

