import { Action } from "@ngrx/store";
import { START_LOADING, STOP_LOADING, UIActions } from './ui.actions';

export interface State {
  isLoading: boolean;
}

// initiate state
const initialState: State = {
  isLoading: false
}

// reducer is just a function which takes 2 arguments
// 1. state, 2. action to be taken on the state
export function uiReducer(state = initialState, action: UIActions) {

  switch (action.type) {
    case START_LOADING:
      return {
        isLoading: true
      };
    case STOP_LOADING:
      return {
        isLoading: false
      };
    default:
      return state;
  }
}

export const getIsLoading = (state: State) => state.isLoading;
