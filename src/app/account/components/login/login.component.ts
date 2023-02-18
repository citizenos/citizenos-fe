import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LocationService } from 'src/app/services/location.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { EstIdLoginComponent } from '../est-id-login/est-id-login.component';
import { SmartIdLoginComponent } from '../smart-id-login/smart-id-login.component';
import { RegisterComponent } from '../register/register.component';
import { PasswordForgotComponent } from '../password-forgot/password-forgot.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userConnections?: any;
  redirectSuccess?: any;
  authMethodsAvailable: any;
  isFormEmailProvided: any;
  linkRegister: any;
  form = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });
  errors: any;

  LOGIN_PARTNERS = {
    facebook: 'facebook',
    google: 'google'
  };

  constructor(public dialog: MatDialog,
    private Location: LocationService,
    private Notification: NotificationService,
    private config: ConfigService,
    private router: Router,
    private UserService: UserService,
    private route: ActivatedRoute,
    private Auth: AuthService) {
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe(value => {
      this.form.patchValue({ 'email': value['email'] });
      this.userConnections = value['userConnections'];
      this.redirectSuccess = value['redirectSuccess'];
      console.log(this.redirectSuccess)
      if (this.userConnections) {
        let userAuthMethods = <any[]>[];

        if (this.userConnections.rows.length) {
          // Check out from the UserConnection.connectionId map which authentication methods apply
          this.userConnections.rows.forEach((val: any) => {
            userAuthMethods = userAuthMethods.concat(this.UserService.USER_CONNECTION_IDS_TO_AUTH_METHOD_MAP[val.connectionId]);
          });

          // Reduce to unique values
          userAuthMethods = userAuthMethods.filter((val, i, res) => {
            return res.indexOf(val) === i;
          });
        } else {
          // IF no UserConnections is returned, that is a for an unregistered user, show 'citizenos' auth method.
          userAuthMethods.push('citizenos');
        }

        // Initially the authMethods that are configured are all available, modify the list so that only those User has available are enabled
        Object.keys(this.authMethodsAvailable).forEach((val) => {
          this.authMethodsAvailable[val] = userAuthMethods.indexOf(val) > -1;
        });
      }
      if (this.Auth.loggedIn$.value) {
       console.log(this.redirectSuccess || '/')
        // window.location = this.redirectSuccess || '/';
      }
    });

    this.authMethodsAvailable = this.config.get('features').authentication;
    this.isFormEmailProvided = !!this.form.get('email');
    this.linkRegister = this.Location.getAbsoluteUrl('/account/signup');

    // UserConnections to know which auth methods to show - https://github.com/citizenos/citizenos-fe/issues/657
    /* const userConnections = this.$stateParams ? this.$stateParams.userConnections : null;
      }*/
  }

  popupCenter(url: string, title: string, w: number, h: number) {
    const userAgent = navigator.userAgent,
      mobile = () => {
        return /\b(iPhone|iP[ao]d)/.test(userAgent) ||
          /\b(iP[ao]d)/.test(userAgent) ||
          /Android/i.test(userAgent) ||
          /Mobile/i.test(userAgent);
      },
      screenX = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
      screenY = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
      outerWidth = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.documentElement.clientWidth,
      outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : document.documentElement.clientHeight - 22,
      targetWidth = mobile() ? 0 : w,
      targetHeight = mobile() ? 0 : h,
      V = screenX < 0 ? window.screen.width + screenX : screenX,
      left = Number(V) + Number(outerWidth - targetWidth) / 2;
    const right = screenY + (outerHeight - targetHeight) / 2.5;
    const features = [];
    if (targetWidth !== 0) {
      features.push('width=' + targetWidth);
    }
    if (targetHeight !== 0) {
      features.push('height=' + targetHeight);
    }
    features.push('left=' + left);
    features.push('top=' + right);
    features.push('scrollbars=1');

    const newWindow = window.open(url, title, features.join(','));

    if (newWindow?.focus) {
      newWindow.focus();
    }

    return newWindow;
  };

  doLogin() {
    //  this.$log.debug('LoginFormCtrl.doLogin()');

    this.errors = null;
    const success = (response: any) => {
      /* if (this.$state.is('partners.consent') || this.$state.is('partners.login')) {
           return window.location.href = this.Location.getAbsoluteUrlApi('/api/auth/openid/authorize');
       } else {*/
      if (this.redirectSuccess) {
        window.location.href = this.redirectSuccess;
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
   * Login with Estonian ID-Card
   */
  doLoginEsteId() {
    this.dialog.open(EstIdLoginComponent, {});
  };

  /**
   * Login with Smart-ID
   */
  doLoginSmartId() {
    this.dialog.open(SmartIdLoginComponent);
  };

  /**
   * Password reset
   */
  doResetPassword() {
    this.dialog.open(PasswordForgotComponent, {
      data: {}
    })
  };

  doLoginPartner(partnerId?: string) {
    // All /widgets/* require pop-up login flow as they are in the iframe
    /*   if (this.$state.includes('widgets')) {
           this.doLoginPartnerPopup(partnerId);
       } else {*/
    this.doLoginPartnerNoPopup(partnerId);
    //  }
  };

  /**
   * Login with partner
   *
   * @param {string} partnerId String representing the partner. For ex "facebook", "google".
   */
  doLoginPartnerPopup(partnerId?: any) {
    if (Object.values(this.LOGIN_PARTNERS).indexOf(partnerId) < 0) {
      throw new Error(`LoginFormCtrl.doLoginPartner() Invalid parameter for partnerId ${partnerId}`);
    }

    const url = this.Location.getAbsoluteUrlApi(
      '/api/auth/:partnerId',
      {
        partnerId: partnerId
      },
      {
        redirectSuccess: this.Location.getAbsoluteUrl('/auth/callback'),
        display: 'popup'
      }
    );

    const redirectSuccess = this.redirectSuccess || this.Location.currentUrl(); // Final url to land after successful login

    const loginWindow = this.popupCenter(url, 'CitizenOS Partner Login', 470, 500);

    if (window.navigator.userAgent.indexOf('Edge') > -1) {
      const popupCheck = setInterval(() => {
        if (loginWindow?.closed) {
          clearInterval(popupCheck);
          window.focus();
          this.Auth
            .status()
            .subscribe((user) => {
              if (user) {
                window.location.href = redirectSuccess;
              }
            });
        }
      }, 250);
    }
  };

  // No-popup partner login version. Used for /partners/{partnerId}/login pages where the popup version would add too much extra complexity with the redirect urls.
  // Popup version was initially needed only for the widget logins. Maybe worth making an exception for the widgets and revert everything else to normal.
  doLoginPartnerNoPopup(partnerId: any) {
    if (Object.values(this.LOGIN_PARTNERS).indexOf(partnerId) < 0) {
      throw new Error(`LoginFormCtrl.doLoginPartner() Invalid parameter for partnerId ${partnerId}`);
    }

    let url = this.Location.getAbsoluteUrlApi('/api/auth/:partnerId', { partnerId: partnerId });
    if (this.redirectSuccess) {
      url += '?redirectSuccess=' + encodeURIComponent(this.redirectSuccess);
    } else {
      const redirectSuccess = this.Location.currentUrl();
      url += '?redirectSuccess=' + redirectSuccess + '?'; // HACK: + '?' avoids digest loop on Angular side for Google callbacks.
    }
    console.log(url)
    window.location.href = url;
  };

  register() {
    this.dialog.open(RegisterComponent, {
      data: {
        email: this.form.value.email,
        redirectSuccess: this.Location.currentUrl()
      }
    })
  }
}

@Component({
  template: ''
})
export class LoginDialogComponent {
  constructor(private dialog: MatDialog, private router: Router) {
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('RESULT')
    });
  }
}
