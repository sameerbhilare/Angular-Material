import { AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './auth.actions';

// type of the state
export interface State {
  isAuthenticated: boolean;
}

// initial state
const initialState: State = {
  isAuthenticated: false
}

// reducer function
export function authReducer(state = initialState, action: AuthActions) {
  switch(action.type) {
    case SET_AUTHENTICATED:
      return {
        isAuthenticated: true
      };
    case SET_UNAUTHENTICATED:
      return {
        isAuthenticated: false
      };
    default:
      return state;
  }
}

// helper function to get the state
export const getIsAuthenticated = (state: State) => state.isAuthenticated;

