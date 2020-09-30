import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  /* To guard our components from being used if user is not logged in.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (this.authService.isAuth()) {
      // user is logged in, so return false
      return true;
    } else {
      // user is not logged in so redirect it to the login page
      // we just cant return false, that won't work as intended. we must redirect the user to proper page.
      this.router.navigate(['/login']);
    }
  }

}
