import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LocationService } from 'src/app/services/location.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public email: any;
  public authMethodsAvailable: any;
  public isFormEmailProvided: any;
  public linkRegister: any;
  public form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  public errors: any;

  public LOGIN_PARTNERS = {
    facebook: 'facebook',
    google: 'google'
  };

  constructor(public dialog: MatDialog, private Location: LocationService, private Notification: NotificationService, private config: ConfigService, private route: ActivatedRoute, private Auth: AuthService) { }

  ngOnInit(): void {

    this.route.params.subscribe(value => {
      this.email = value['email'];
    });
    this.authMethodsAvailable = this.config.get('features').authentication;
    this.isFormEmailProvided = this.email;
    this.linkRegister = this.Location.getAbsoluteUrl('/account/signup');

    // UserConnections to know which auth methods to show - https://github.com/citizenos/citizenos-fe/issues/657
    /* const userConnections = this.$stateParams ? this.$stateParams.userConnections : null;
      if (userConnections) {
          let userAuthMethods = [];

          if (userConnections.rows.length) {
              // Check out from the UserConnection.connectionId map which authentication methods apply
              userConnections.rows.forEach((val) => {
                  userAuthMethods = userAuthMethods.concat(sUser.USER_CONNECTION_IDS_TO_AUTH_METHOD_MAP[val.connectionId]);
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
      /*  if (this.$state.is('partners.consent') || this.$state.is('partners.login')) {
            return this.$window.location.href = this.sLocation.getAbsoluteUrlApi('/api/auth/openid/authorize');
        } else {
            if (this.$stateParams.redirectSuccess) {
                this.$window.location.href = this.$stateParams.redirectSuccess;
            } else {
                this.$window.location.reload();
            }
        }*/
    };

    this.Auth
      .login(this.form.value.email, this.form.value.password)
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
    /* this.dialog.open(ActivityFeed, {});
       this.dialog
           .open(EstIdLoginComponent);*/
  };

  /**
   * Login with Smart-ID
   */
  doLoginSmartId() {
    /*this.dialog
      .open(SmartIdLoginComponent);*/
  };

  /**
   * Password reset
   */
  doResetPassword() {
    /* this.ngDialog
         .open({
             template: '<password-forgot></password-forgot>',
             plain: true
         });*/
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

    // const redirectSuccess = this.$stateParams.redirectSuccess || this.Location.currentUrl(); // Final url to land after successful login

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
                window.location.href = this.Location.currentUrl(); //redirectSuccess
              }
            });
        }
      }, 250);
    }

    /* const messageHandler = (message) => {
         loginWindow.close();
         window.focus();
         window.location.href = redirectSuccess;
     };
     window.addEventListener('message', messageHandler, false);*/
  };

  // No-popup partner login version. Used for /partners/{partnerId}/login pages where the popup version would add too much extra complexity with the redirect urls.
  // Popup version was initially needed only for the widget logins. Maybe worth making an exception for the widgets and revert everything else to normal.
  doLoginPartnerNoPopup(partnerId: any) {
    if (Object.values(this.LOGIN_PARTNERS).indexOf(partnerId) < 0) {
      throw new Error(`LoginFormCtrl.doLoginPartner() Invalid parameter for partnerId ${partnerId}`);
    }

    let url = this.Location.getAbsoluteUrlApi('/api/auth/:partnerId', { partnerId: partnerId });
    console.log(url);
    console.log(this.route.snapshot.params);
    /* if (this.$stateParams.redirectSuccess) {
         url += '?redirectSuccess=' + encodeURIComponent(this.$stateParams.redirectSuccess);
     } else {
         const redirectSuccess = this.sLocation.currentUrl();
         url += '?redirectSuccess=' + redirectSuccess + '?'; // HACK: + '?' avoids digest loop on Angular side for Google callbacks.
     }*/

    window.location.href = url;
  };
}
