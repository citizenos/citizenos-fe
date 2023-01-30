import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { switchMap, catchError, tap, map, } from 'rxjs/operators';
import { LocationService } from './location.service';
import { NotificationService } from './notification.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User> | null;
  public loggedIn$ = new BehaviorSubject(false);
  public user = new BehaviorSubject({ id: null });

  constructor(private Location: LocationService, private http: HttpClient, private Notification: NotificationService) {
    this.user$ = this.status();
    this.loggedIn$.pipe(tap((status) => {
      if (status === false) {
        this.logout();
      }
    }))
  }

  resolveAuthorizedPath(path: string) {
    let authorized = '';
    const pathName = this.loggedIn$.subscribe((res) => {
      if (res === true) {
        authorized = '/users/self';
      }

      return `/api${authorized}${path}`
    });
    return `/api${authorized}${path}`
  }

  signUp(email: string, password: string, name: string, company: string, redirectSuccess: string, preferences: object, termsVersion: string) {
    const data = {
      email: email,
      password: password,
      name: name,
      company: company,
      redirectSuccess: redirectSuccess,
      preferences: preferences,
      termsVersion: termsVersion
    };

    const path = this.Location.getAbsoluteUrlApi('/api/auth/signup');

    return this.http.post(path, data);
  };

  login(email: string, password: string) {
    const data = {
      email: email,
      password: password
    };

    const path = this.Location.getAbsoluteUrlApi('/api/auth/login');

    return this.http.post<any>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      })
    );
  };

  logout() {
    const pathLogoutEtherpad = this.Location.getAbsoluteUrlEtherpad('/ep_auth_citizenos/logout');
    const pathLogoutAPI = this.Location.getAbsoluteUrlApi('/api/auth/logout');

    return combineLatest([
      this.http.get(pathLogoutEtherpad, { withCredentials: true, responseType: 'text' }),
      this.http.post(pathLogoutAPI, {}, { withCredentials: true })]).pipe(
        switchMap(([res]) => {
          this.user$ = null;
          return res;
        }),
        catchError((err) => {
          console.log(err); return err;
        })
      ).subscribe();
  }

  status() {
    const path = this.Location.getAbsoluteUrlApi('/api/auth/status');
    return this.user$ = this.http.get<User>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      switchMap((res: any) => {
        const user = res.data;
        user.loggedIn = true;
        this.user.next({ id: user.id });
        this.loggedIn$.next(true);
        return of(user);
      }),
      catchError(res => {
        if (res.error) {
          if (res.status !== 401) {
            this.Notification.addError(res.error.status.message);
          }
        }
        return of(null);
      }),
      map(res =>res)
    );
  };
}
