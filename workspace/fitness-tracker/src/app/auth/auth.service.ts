import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {

  isAuthenticated: boolean = false;
  authChange = new Subject<boolean>();

  constructor(private router: Router,
              private firebaseAuth: AngularFireAuth,
              private trainingService: TrainingService) {}

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

    this.firebaseAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log(error));
  }

  /**
   * Login a user
   * @param authData
   */
  login(authData: AuthData) {
    this.firebaseAuth
    .signInWithEmailAndPassword(authData.email, authData.password)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => console.log(error));
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
