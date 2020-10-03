import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from "@ngrx/store";
import * as fromRoot from '../app.reducer';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private store: Store<fromRoot.State>) {}

  /**
   * To guard our component from being loaded if user is not logged in.
   * NOTE: Rediction in both cases (authenticated/unauthenticated)
   *       is handled by the initializeAuthListener() in auth.service.
   *
   * @param route
   * @param segments
   */
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // this observable runs forever but Guard runs only once hence we need to use take(1) operator
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }

  /* To guard our components from being used if user is not logged in.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // this observable runs forever but Guard runs only once hence we need to use take(1) operator
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }

}
