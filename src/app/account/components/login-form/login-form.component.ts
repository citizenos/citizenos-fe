import { AuthService } from 'src/app/services/auth.service';
import { Component, Inject, Input } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/shared/dialog';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PasswordForgotComponent } from '../password-forgot/password-forgot.component';
import { TranslateService } from '@ngx-translate/core';
import { RegisterDialogComponent } from '../register/register.component';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Input() redirectSuccess?: any;
  @Input() email?: string;
  @Input() isDialog = false;

  isFormEmailProvided: any;
  showPassword = false;
  linkRegister: any;
  loginForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl(),
  });
  errors: any;

  constructor(public dialog: DialogService,
    private Location: LocationService,
    private Notification: NotificationService,
    @Inject(Router) private router: Router,
    private translate: TranslateService,
    private Auth: AuthService) {
  }

  ngOnInit(): void {
    if (this.email) {
      this.loginForm.patchValue({ 'email': this.email });
    }
    console.log(this.redirectSuccess);
    this.isFormEmailProvided = !!this.loginForm.get('email');
    this.linkRegister = this.Location.getAbsoluteUrl('/account/signup');
    if (this.Auth.loggedIn$.value) {
      if (this.redirectSuccess) {
        this.router.navigateByUrl(this.redirectSuccess)
      } else {
        this.router.navigate(['/dashboard'])
      }
    }
  }

  doLogin() {
    //  this.$log.debug('LoginFormCtrl.doLogin()');
    if (this.loginForm.value.pid && this.loginForm.value.countryCode) {
      this.errors = null;

      this.Auth
        .login(this.loginForm.get('email')?.value, this.loginForm.value.password)
        .subscribe({
          next: (response: any) => {
            /* if (this.$state.is('partners.consent') || this.$state.is('partners.login')) {
                 return window.location.href = this.Location.getAbsoluteUrlApi('/api/auth/openid/authorize');
             } else {*/
            if (this.redirectSuccess) {
              console.log('SUCCESS', this.redirectSuccess);
              if (typeof this.redirectSuccess === 'string') {
                window.location.href = this.redirectSuccess;
              } else {

                this.router.navigate(this.redirectSuccess);
              }
            } else {
              window.location.reload();
            }
            //    }
          },
          error: (error) => {
            const status = error.status;

            switch (status.code) {
              case 40001: // Account does not exist
                this.Notification.removeAll();
                this.errors = { accoundDoesNotExist: true };
                break;
              default:
                this.errors = error.data?.errors || error;
            }
          }
        });
    }
  };

  /**
   * Password reset
   */
  doResetPassword() {
    this.dialog.open(PasswordForgotComponent, {
      data: {}
    })
  };

  register() {
    this.dialog.closeAll();
    this.router.navigate(['/account/signup']);
  }
}
