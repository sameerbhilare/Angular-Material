import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {

  isAuthenticated: boolean = false;
  authChange = new Subject<boolean>();

  constructor(private router: Router,
              private firebaseAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UIService) {}

  /**
   * This function must be called as soon as our app starts. So basically from AppComponent
   */
  initializeAuthListener() {
    // we can subscribe to the firestore authState Observable
    // in orde to get notified about authenticated vs unauthenticated states.
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        // user authenticated
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        // user not authenticated
        // cancel all firestore subscriptions to handle the console errors.
        this.trainingService.cancelFirestoreSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  /**
   * Signup a user
   * @param authData
   */
  registerUser(authData: AuthData) {

    this.uiService.loadingStateChanged.next(true);
    this.firebaseAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  /**
   * Login a user
   * @param authData
   */
  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.firebaseAuth
    .signInWithEmailAndPassword(authData.email, authData.password)
    .then((result) => {
      this.uiService.loadingStateChanged.next(false);
    })
    .catch((error) => {
      this.uiService.loadingStateChanged.next(false);
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

  isAuth() {
    return this.isAuthenticated;
  }
}
