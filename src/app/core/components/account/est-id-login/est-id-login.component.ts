import { NotificationService } from 'src/app/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { catchError, interval, map, of, switchMap, take, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { MatDialog } from '@angular/material/dialog';
declare let hwcrypto: any;

@Component({
  selector: 'app-est-id-login',
  templateUrl: './est-id-login.component.html',
  styleUrls: ['./est-id-login.component.scss']
})
export class EstIdLoginComponent implements OnInit {
  config:any;
  pid?: string;
  phoneNumber?: string;
  challengeID?: number | null;
  isLoading = false;
  isLoadingIdCard = false;
  authMethodsAvailable;
  wWidth = window.innerWidth;
  constructor(cosConfig: ConfigService, private AuthService: AuthService, private Notification: NotificationService, private dialog: MatDialog) {
    this.config = cosConfig.get('features');
    this.authMethodsAvailable = Object.assign({}, this.config.authentication);
  }

  ngOnInit(): void {
  }

  authMobiilId() {
    console.debug('LoginEstEIdController.doLoginMobiilId()');
    if (this.pid && this.phoneNumber) {

      this.isLoading = true;
      this.AuthService
        .loginMobiilIdInit(this.pid, this.phoneNumber) //,this.$stateParams.userId
        .pipe(take(1),
          catchError((err) => {
            this.isLoading = false;
            this.challengeID = null;
            console.error(err);
            return of(err);
          }))
        .subscribe((loginMobileIdInitResult) => {
          this.isLoading = false;
          if (loginMobileIdInitResult.challengeID && loginMobileIdInitResult.token) {
            this.challengeID = loginMobileIdInitResult.challengeID;
            const token = loginMobileIdInitResult.token;
            return this.pollMobiilIdLoginStatus(token, 3000, 80);
          }
        })
    }
  };

  authIdCard() {
    console.debug('LoginEstEIdController.doLoginIdCard()');

    this.isLoadingIdCard = true;

    hwcrypto
      .getCertificate({})
      .then((certificate: any) => {
        this.AuthService.loginIdCard().pipe(
          take(1)
        ).subscribe((authRes) => {
          console.log(authRes);1
          this.isLoadingIdCard = false;

          this.AuthService.status().pipe(take(1)).subscribe();
          this.dialog.closeAll();
          console.log(authRes);
        })
      }, (err:any) => {
        this.isLoadingIdCard = false;
        let message = err.message
        if (message === 'no_certificates') {
          message = 'MSG_ERROR_HWCRYPTO_NO_CERTIFICATES';
        }
        this.Notification.addError(message);
      });
/*
      .then(() => {
        this.sAuth
          .loginIdCard(this.$stateParams.userId)
          .then(() => {
            this.handleLoginSuccess();
          }, (err) => {
            this.$log.error('Something failed when trying to log in with card', err);

            this.isLoadingIdCard = false;
          });
      }*/
  };

  handleLoginSuccess() {
    /* if (this.$state.is('partners.consent') || this.$state.is('partners.login')) {
         return this.$window.location.href = this.sLocation.getAbsoluteUrlApi('/api/auth/openid/authorize');
     } else {
         if (this.$stateParams.redirectSuccess) {
             // TODO: I guess checking the URL would be nice in the future...
             return this.$window.location.href = this.$stateParams.redirectSuccess;
         } else {
             this.$window.location.reload();
         }
     }*/
  };

  pollMobiilIdLoginStatus(token: string, milliseconds: number, retry: number) {
    const delay = interval(milliseconds);
    this.isLoading = true;
    const authResult = delay.pipe(
      switchMap((data) => {
        return this.AuthService.loginMobiilIdStatus(token);
      })
    );
    authResult.pipe(
      takeWhile((res: any,) => {
        console.log(res)
        return (res.status?.code === 20001)
      }, true),
      map(res => res.data),
      catchError((error) => {
        console.log('ERROR', error);
        this.isLoading = false;
        this.challengeID = null;
        return of(error);
      })).subscribe((response) => {
        console.log(response)
        this.isLoading = false;
        this.challengeID = null;
        this.AuthService.status().pipe(take(1)).subscribe();
        this.dialog.closeAll();
      });
  };
  /*  if (!retry) retry = 80;
    if (!retry--) throw new Error('Too many retries');

    return this.$timeout(() => {
        return this.sAuth.loginMobiilIdStatus(token)
            .then((response) => {
                const statusCode = response.data.status.code;
                switch (statusCode) {
                    case 20001:
                        return this.$timeout(() => {
                            return this.pollMobiilIdLoginStatus(token, milliseconds, retry);
                        }, milliseconds, false);
                    case 20002:
                        // Existing User logged in
                        return;
                    case 20003:
                        // New User was created and logged in
                        return;
                    default:
                        this.$log.error('Mobile login failed', response);
                        return this.$q.defer().reject(response);
                }
            });
    }, milliseconds, false);*/
}
