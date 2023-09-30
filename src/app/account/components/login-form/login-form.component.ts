import { AuthService } from 'src/app/services/auth.service';
import { Component, Inject, Input } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { PasswordForgotComponent } from '../password-forgot/password-forgot.component';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Input() redirectSuccess?: any;
  @Input() email?: string;
  isFormEmailProvided: any;
  linkRegister: any;
  form = new UntypedFormGroup({
    email: new UntypedFormControl(),
    password: new UntypedFormControl(),
  });
  errors: any;

  constructor(public dialog: MatDialog,
    private Location: LocationService,
    private Notification: NotificationService,
    @Inject(Router) private router: Router,
    private Auth: AuthService) {
  }

  ngOnInit(): void {
    if (this.email) {
      this.form.patchValue({'email': this.email});
    }
    this.isFormEmailProvided = !!this.form.get('email');
    this.linkRegister = this.Location.getAbsoluteUrl('/account/signup');
    if (this.Auth.loggedIn$.value) {
      window.location = this.redirectSuccess || '/';
    }
  }

  doLogin() {
    //  this.$log.debug('LoginFormCtrl.doLogin()');

    this.errors = null;
    const success = (response: any) => {
      /* if (this.$state.is('partners.consent') || this.$state.is('partners.login')) {
           return window.location.href = this.Location.getAbsoluteUrlApi('/api/auth/openid/authorize');
       } else {*/
      if (this.redirectSuccess) {
        if (typeof this.redirectSuccess === 'string') {
          this.router.navigateByUrl(this.redirectSuccess);
        } else {

          this.router.navigate(this.redirectSuccess);
        }
      } else {
        window.location.reload();
      }
      //    }
    };

    this.Auth
      .login(this.form.get('email')?.value, this.form.value.password)
      .subscribe({
        next: success, error: (error) => {
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
  };

  /**
   * Password reset
   */
  doResetPassword() {
    this.dialog.open(PasswordForgotComponent, {
      data: {}
    })
  };
}
