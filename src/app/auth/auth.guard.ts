import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private AuthService: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.AuthService.loggedIn$.value) {
      return this.router.parseUrl('/');
    }
    return true;
  }

}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardLogin  {
  constructor(private AuthService: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.AuthService.loggedIn$.value) {
      return this.router.parseUrl('/');
    }
    return true;
  }

}
