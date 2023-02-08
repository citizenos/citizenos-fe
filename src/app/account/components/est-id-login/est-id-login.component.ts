import { Component, OnInit } from '@angular/core';
import { catchError, interval, map, of, switchMap, take, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
declare let hwcrypto: any;

@Component({
  selector: 'app-est-id-login',
  templateUrl: './est-id-login.component.html',
  styleUrls: ['./est-id-login.component.scss']
})
export class EstIdLoginComponent implements OnInit {
  config: any;
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
        .loginMobiilIdInit({ pid: this.pid, phoneNumber: this.phoneNumber })
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
          this.isLoadingIdCard = false;

          this.AuthService.status().pipe(take(1)).subscribe();
          this.dialog.closeAll();
        })
      }, (err: any) => {
        this.isLoadingIdCard = false;
        let message = err.message
        if (message === 'no_certificates') {
          message = 'MSG_ERROR_HWCRYPTO_NO_CERTIFICATES';
        }
        this.Notification.addError(message);
      });
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
        return (res.status?.code === 20001)
      }, true),
      map(res => res.data),
      catchError((error) => {
        console.error('ERROR', error);
        this.isLoading = false;
        this.challengeID = null;
        return of(error);
      })).subscribe((response) => {
        this.isLoading = false;
        this.challengeID = null;
        this.AuthService.status().pipe(take(1)).subscribe();
        this.dialog.closeAll();
      });
  };
}
