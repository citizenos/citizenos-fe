import { NotificationService } from 'src/app/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { interval, map, switchMap, take, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ConfigService } from 'src/app/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
declare let hwcrypto: any;


@Component({
  selector: 'app-connect-eid',
  templateUrl: './connect-eid.component.html',
  styleUrls: ['./connect-eid.component.scss']
})
export class ConnectEidComponent implements OnInit {

  config: any;
  pid?: string;
  phoneNumber?: string;
  challengeID?: number | null;
  isLoading = false;
  isLoadingIdCard = false;
  authMethodsAvailable;
  wWidth = window.innerWidth;
  constructor(private app: AppService, cosConfig: ConfigService, private AuthService: AuthService, private UserService: UserService, private Notification: NotificationService, private dialog: MatDialog) {
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
        .loginMobiilIdInit({ pid: this.pid, phoneNumber: this.phoneNumber }) //,this.$stateParams.userId
        .pipe(take(1))
        .subscribe({
          next: (loginMobileIdInitResult) => {
            this.isLoading = false;
            if (loginMobileIdInitResult.challengeID && loginMobileIdInitResult.token) {
              this.challengeID = loginMobileIdInitResult.challengeID;
              const token = loginMobileIdInitResult.token;
              return this.pollMobiilIdLoginStatus(token, 3000, 80);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.challengeID = null;
            console.error(err);
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
        ).subscribe({
          next: (authRes: any) => {
            this.isLoadingIdCard = false;
            this.UserService.addUserConnection(this.AuthService.user?.value.id || '', 'esteid', authRes.token)
            this.AuthService.status().pipe(take(1)).subscribe();
            this.dialog.closeAll();
          }, error: (res) => {
            this.isLoadingIdCard = false;
            console.error(res)
          }
        })
      }, (err: any) => {
        this.isLoadingIdCard = false;
        let message = '';
        if (err instanceof Error) { //hwcrypto and JS errors
          message = this.app.hwCryptoErrorToTranslationKey(err);
        } else {
          message = err.status.message;
        }
        this.Notification.addError(message);
      });
  };

  pollMobiilIdLoginStatus(token: string, milliseconds: number, retry: number) {
    const delay = interval(milliseconds);
    this.isLoading = true;
    const authResult = delay.pipe(
      switchMap((data) => {
        return this.UserService.addUserConnection(this.AuthService.user?.value.id || '', 'esteid', token);
      })
    );
    authResult.pipe(
      takeWhile((res: any,) => {
        return (res.status?.code === 20001)
      }, true),
      map(res => res.data),
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.challengeID = null;
        this.AuthService.status().pipe(take(1)).subscribe();
        this.dialog.closeAll();
      }, error: (res) => {
        console.error('ERROR', res);
        this.isLoading = false;
        this.challengeID = null;
      }
    });
  };

}
