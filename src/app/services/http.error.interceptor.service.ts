import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from './location.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  API_REQUEST_REGEX = /\/api\/(?!auth\/status).*/i; //Filter out status 401 errors
  API_REQUEST_JOIN = /api\/(topics?|groups).\/join/i; //Filter out status 401 errors
  constructor(private Notification: NotificationService, private translate: TranslateService, private Location: LocationService, private Router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        tap((response) => {
          const undefinedUrlParams = request.url.match(/(\/):+\w+/gi);
          if (undefinedUrlParams?.length) {
            throw new Error(`Undefined URL params: ${undefinedUrlParams.join(',')}`);
          }
        }),
        catchError((response: HttpErrorResponse) => {
          this.Notification.removeAll();
          let errorMsg = '';
          if (!response.error || response.error instanceof ErrorEvent) {
            errorMsg = response.error?.message || response.message;
            console.error(`Client side error:' ${errorMsg} `);
            if (!response.error) {
              this.Notification.addError(response.message);
              return throwError(() => response);
            }
          }
          else {
            errorMsg = response.message;
            console.error(`Server side error:', ${errorMsg} `);
            console.log(response.error)
            if (response.url?.match(this.API_REQUEST_JOIN) && response.status === 404) {
              return throwError(() => response.error);
            }

            if (response.status === 404) {
              this.Router.navigate(['/error/404'], { queryParams: { redirectSuccess: this.Location.getAbsoluteUrl(window.location.pathname) + window.location.search } });
              return throwError(() => response.error);
            }

            if (response.url?.match(this.API_REQUEST_REGEX) && response?.status === 401) {
              // Cannot use $state here due to circular dependencies with $http
              if(response.error && response.error.status?.message !== 'Unauthorized' || response.error.status?.code !==  40100) {} else {
                this.Router.navigate(['/account/login'], { queryParams: { redirectSuccess: this.Location.getAbsoluteUrl(window.location.pathname) + window.location.search } });
              }

              this.Notification.addError(response.error.message || response.error.status?.message);
              return throwError(() => response.error);
            }
          }


          try {
            const keys = <{ [key: string]: string }>this.errorsToKeys(response, request.method);
            Object.values(keys).forEach((err: string) => {
              this.Notification.addError(err);
            });
          } catch (err) {
            // Catch all so that promise get rejected later with response to continue interceptor chain
            //   this.Notification.addError(err);
            console.warn('cosHttpApiErrorInterceptor.responseError', 'Failed to translate errors', response, err);
          }
          return throwError(() => response.error);
        })
      )
  }

  /**
   * A method to convert errors in response object to translation keys
   *
   * NOTE: Not returning the whole translated message as placeholders may need to be substituted
   *
   * @param {object} errorResponse Response object
   */
  errorsToKeys(errorResponse: any | undefined, method: string) {
    if (!errorResponse) {
      throw new Error(`cosHttpApiErrorInterceptor.errorsToKeys(), Missing one or more required parameters, ${arguments}`);
    }

    if (errorResponse.error && errorResponse.error.errors) {
      return this.fieldErrorsToKeys(errorResponse, method);
    } else {
      return this.generalErrorToKey(errorResponse, method);
    }
  };

  getGeneralErrorTranslationKey(errorResponse: any | undefined, method: string) {
    const GENERAL_ERROR_KEY_PATTERN = 'MSG_ERROR_:method_:path_:statusCode';

    const url = errorResponse.url;
    if (!url) {
      return errorResponse.message;
    }
    if (url.indexOf('ep_auth_citizenos') > -1) {
      return errorResponse.message;
    }
    const path = url.match(this.API_REQUEST_REGEX)[0]
      .replace(/\/self\//g, '_')
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig, '_')
      .replace(/join\/[a-zA-Z0-9]*/, 'join/token')
      .replace(/\//g, '_');


    const statusCode = (errorResponse.error.status && errorResponse.error.status.code) ? errorResponse.error.status.code : errorResponse.status;

    return GENERAL_ERROR_KEY_PATTERN
      .replace(':method', method)
      .replace(':path', path)
      .replace(':statusCode', statusCode)
      .replace(/[_]+/g, '_')
      .toUpperCase();
  };

  fieldErrorsToKeys(errorResponse: any | undefined, method: string) {
    const errors = errorResponse.error.errors;
    Object.keys(errors).forEach((key) => {
      let translationKey = this.getGeneralErrorTranslationKey(errorResponse, method);
      translationKey += '_' + key.toUpperCase();

      if (translationKey !== this.translate.instant(translationKey, {})) {
        errors[key] = translationKey;
      } else {
        errors[key] = errors[key] + ' *'; // Add asterisk to the end so its easy to see that untranslated message was shown
      }
    });

    return errors;
  };

  generalErrorToKey(errorResponse: any | null | undefined, method: string) {
    if (errorResponse.status < 0) {
      this.Notification.addError('MSG_ERROR_NETWORK_PROBLEMS');
      return;
    }

    const GENERAL_ERROR_FALLBACK_KEY_PATTERN = 'MSG_ERROR_:statusCode';

    const translationKey = this.getGeneralErrorTranslationKey(errorResponse, method);

    const translationKeyHeading = translationKey + '_HEADING'; // Error/info dialog heading key
    const statusCode = (errorResponse.error.status && errorResponse.error.status.code) ? errorResponse.error.status.code : errorResponse.status;
    const translationKeyFallback = GENERAL_ERROR_FALLBACK_KEY_PATTERN
      .replace(':statusCode', statusCode);
    // The key exists/*

    if (translationKey !== this.translate.instant(translationKey, {}) && errorResponse.status) {
      errorResponse.error.status.message = translationKey;
      if (translationKeyHeading !== this.translate.instant(translationKeyHeading, {})) {
        // We have a translation for a heading which means we want to show the error/info dialog
        this.Notification.showDialog(translationKeyHeading, translationKey);
      } else {
        // We DON'T have a translation for a heading which means we want to show the generic error bar
        this.Notification.addError(translationKey);
      }
      // Use fallback to generic error
    } else if (translationKeyFallback !== this.translate.instant(translationKeyFallback, {})) {
      if (errorResponse.error.status) {
        errorResponse.error.status.message = translationKeyFallback;
      }
      this.Notification.addError(translationKeyFallback);
    } else {
      console.warn('cosHttpApiErrorInterceptor.generalErrorToKey', 'No translation for', translationKey, translationKeyFallback, errorResponse);
      this.Notification.addError(errorResponse.error?.status?.message ? errorResponse.error.status.message + ' *' : errorResponse.status + ' - ' + errorResponse.message + ' *');
    }
  };

}
