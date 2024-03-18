import { Component, Input } from '@angular/core';
import { catchError, interval, map, of, switchMap, take, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { DialogService } from 'src/app/shared/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
declare let hwcrypto: any;

@Component({
  selector: 'est-id-login-form',
  templateUrl: './est-id-login-form.component.html',
  styleUrls: ['./est-id-login-form.component.scss']
})
export class EstIdLoginFormComponent {
  @Input() redirectSuccess?: any;
  config: any;
  mobiilIdForm = new UntypedFormGroup({
    pid: new UntypedFormControl('', Validators.compose([Validators.pattern(/^[0-9]{11}$/), Validators.required])),
    phoneNumber: new UntypedFormControl('', Validators.compose([Validators.pattern(/^\+?[0-9\s-]{7,}$/), Validators.required]))
  });
  challengeID?: number | null;
  isLoading = false;
  isLoadingIdCard = false;
  authMethodsAvailable;
  wWidth = window.innerWidth;

  constructor(cosConfig: ConfigService,
    private AuthService: AuthService,
    private Notification: NotificationService,
    private router: Router,
    private dialog: DialogService,
    private route: ActivatedRoute) {
    this.config = cosConfig.get('features');
    this.authMethodsAvailable = Object.assign({}, this.config.authentication);
    this.route.queryParams.subscribe(value => {
      this.redirectSuccess = this.redirectSuccess || value['redirectSuccess'];
    });
  }

  authMobiilId() {
    console.debug('LoginEstEIdController.doLoginMobiilId()');
    if (this.mobiilIdForm.value.pid && this.mobiilIdForm.value.phoneNumber) {

      this.isLoading = true;
      this.AuthService
        .loginMobiilIdInit({ pid: this.mobiilIdForm.value.pid, phoneNumber: this.mobiilIdForm.value.phoneNumber })
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
          next: (authRes) => {
            this.isLoadingIdCard = false;

            this.AuthService.reloadUser();
            this.dialog.closeAll();
            if (this.redirectSuccess) {
              if (typeof this.redirectSuccess === 'string') {
                this.router.navigateByUrl(this.redirectSuccess);
              }
            } else {
              window.location.reload();
            }
          },
          error: (res) => {
            this.isLoadingIdCard = false;
            console.error(res);
          }
        })
      }, (err: any) => {
        this.isLoadingIdCard = false;
        let msg = null;
        if (err instanceof Error) { //hwcrypto and JS errors
          msg = this.hwCryptoErrorToTranslationKey(err);
        } else { // API error response
          msg = err.status.message;
        }
        this.Notification.addError(msg);
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
      map(res => res.data)).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.challengeID = null;
          this.AuthService.reloadUser();
          this.dialog.closeAll();
          if (this.redirectSuccess) {
            if (typeof this.redirectSuccess === 'string') {
              this.router.navigateByUrl(this.redirectSuccess);
            }
          } else {
            window.location.reload();
          }
        }, error: (err) => {
          this.isLoading = false;
          this.challengeID = null;
        }
      });
  };

  hwCryptoErrorToTranslationKey(err: any) {
    const errorKeyPrefix = 'MSG_ERROR_HWCRYPTO_';
    switch (err.message) {
      case hwcrypto.NO_CERTIFICATES:
      case hwcrypto.USER_CANCEL:
      case hwcrypto.NO_IMPLEMENTATION:
        return errorKeyPrefix + err.message.toUpperCase();
        break;
      case hwcrypto.INVALID_ARGUMENT:
      case hwcrypto.NOT_ALLOWED:
      case hwcrypto.TECHNICAL_ERROR:
        console.error(err.message, 'Technical error from HWCrypto library', err);
        return errorKeyPrefix + 'TECHNICAL_ERROR';
        break;
      default:
        console.error(err.message, 'Unknown error from HWCrypto library', err);
        return errorKeyPrefix + 'TECHNICAL_ERROR';
    }
  };
}
