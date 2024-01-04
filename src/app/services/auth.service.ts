import { ConfigService } from 'src/app/services/config.service';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { of, BehaviorSubject, Observable, throwError } from 'rxjs';
import { switchMap, catchError, tap, take, map, retry, exhaustMap, shareReplay, combineLatestWith } from 'rxjs/operators';
import { LocationService } from './location.service';
import { NotificationService } from './notification.service';
import { User } from '../interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loadUser$ = new BehaviorSubject<void>(undefined);
  public user$: Observable<User>;
  public loggedIn$ = new BehaviorSubject(false);
  public user = new BehaviorSubject({ id: <string|null>null });

  constructor(private dialog: MatDialog, private Location: LocationService, private http: HttpClient, private Notification: NotificationService, private config: ConfigService) {
    this.user$ = this.loadUser$.pipe(
      exhaustMap(() => this.status()),
      shareReplay()
    );

    this.loggedIn$.pipe(tap((status) => {
      if (status === false) {
        this.logout().pipe(take(1)).subscribe(() => console.log('logged out'));
      }
    }))
  }
  reloadUser(): void {
    this.loadUser$.next();
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

  signUp(data: any) {

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

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  logout() {
    const pathLogoutEtherpad = this.Location.getAbsoluteUrlEtherpad('/ep_auth_citizenos/logout');
    const pathLogoutAPI = this.Location.getAbsoluteUrlApi('/api/auth/logout');



    return this.http.get(pathLogoutEtherpad, { withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        combineLatestWith(this.http.post(pathLogoutAPI, {}, { withCredentials: true, responseType: 'json', observe: 'body' })),
        map(([res1, res2]) => {
          this.reloadUser();
          this.loggedIn$.next(false);
          return res2;
        }),
        retry(2), // retry 2 times on error
        catchError(this.handleError)
      );
  }

  status() {
    const path = this.Location.getAbsoluteUrlApi('/api/auth/status');

    return this.user$ = this.http.get<User>(path, { withCredentials: true, observe: 'body' }).pipe(
      switchMap((res: any) => {
        const user = res.data;
        if (!user.termsVersion || user.termsVersion !== this.config.get('legal').version || !user.email) {
         return of(user);
        } else {
          user.loggedIn = true;
          this.user.next({ id: user.id });
          this.loggedIn$.next(true);
          return of(user);
        }
      }),
      catchError(res => {
        if (res.error) {
          if (res.status !== 401) {
            this.Notification.addError(res.error.status.message);
          }
        }
        return of(null);
      }),
      map(res => res)
    );
  };

  loginMobiilIdInit(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/auth/mobile/init');

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  };

  loginMobiilIdStatus(token: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/auth/mobile/status');

    return this.http.get<ApiResponse>(path, { params: { token: token }, withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  };

  loginSmartIdInit(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/auth/smartid/init');

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  };

  loginSmartIdStatus(token: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/auth/smartid/status');

    return this.http.get<ApiResponse>(path, { params: { token: token }, withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  };

  idCardInit() {
    return this.http.get<ApiResponse>(this.config.get('features').authentication.idCard.url, { withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        map(res => res.data),
        tap(res => console.log(res))
      );
  };
  loginIdCard(userId?: string) {
    return this.idCardInit()
      .pipe(
        switchMap((response) => {
          if (response.token) {
            const path = this.Location.getAbsoluteUrlApi('/api/auth/id');
            if (userId) {
              response.userId = userId;
            }
            return this.http.get(path, { params: response, withCredentials: true, responseType: 'json', observe: 'body' });
          } else {
            return response;
          }
        })
      );
  };

  passwordReset(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/auth/password/reset');
    return this.http.post<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  };

  passwordResetSend(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/auth/password/reset/send');
    return this.http.post<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  };
}

export const authResolver: ResolveFn<User> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(AuthService).status();
  };
