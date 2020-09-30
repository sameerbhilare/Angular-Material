import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {

  private user: User;
  authChange = new Subject<boolean>();

  constructor(private router: Router) {}

  registerUser(authaData: AuthData) {
    this.user = {
      email: authaData.email,
      userId: Math.round(Math.random() * 1000).toString()
    }
    this.authSuccessful();
  }

  login(authaData: AuthData) {
    this.user = {
      email: authaData.email,
      userId: Math.round(Math.random() * 1000).toString()
    }
    this.authSuccessful();
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  isAuth() {
    return this.user != null;
  }

  getUser() {
    return {...this.user};
  }

  private authSuccessful() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
