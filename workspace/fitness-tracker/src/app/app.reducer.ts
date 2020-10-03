import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromUI from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

// Application wide state
export interface State {
  ui: fromUI.State;
  auth: fromAuth.State;
}

// registering all reducers for this application
export const reducers: ActionReducerMap<State> = {
  ui: fromUI.uiReducer, // slice: reducer
  auth: fromAuth.authReducer
}

// helper functions
export const getUiState = createFeatureSelector<fromUI.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUI.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuthenticated = createSelector(getAuthState, fromAuth.getIsAuthenticated);
