import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UIService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';
import * as fromRoot from '../app.reducer';
import * as UI from "../shared/ui.actions";
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {

  constructor(private router: Router,
              private firebaseAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UIService,
              private store: Store<fromRoot.State>) {}

  /**
   * This function must be called as soon as our app starts. So basically from AppComponent
   */
  initializeAuthListener() {
    // we can subscribe to the firestore authState Observable
    // in orde to get notified about authenticated vs unauthenticated states.
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        // user authenticated
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        // user not authenticated
        // cancel all firestore subscriptions to handle the console errors.
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.trainingService.cancelFirestoreSubscriptions();
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Signup a user
   * @param authData
   */
  registerUser(authData: AuthData) {

    //this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.firebaseAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  /**
   * Login a user
   * @param authData
   */
  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.firebaseAuth
    .signInWithEmailAndPassword(authData.email, authData.password)
    .then((result) => {
      this.store.dispatch(new UI.StopLoading());
    })
    .catch((error) => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackBar(error.message, null, 3000);
    });
  }

  /**
   * Logout current user
   */
  logout() {
    // signout user
    this.firebaseAuth.signOut();
  }
}
