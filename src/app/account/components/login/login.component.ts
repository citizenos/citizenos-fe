import { Component, Inject, inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user.service';
import { EstIdLoginDialogComponent } from '../est-id-login/est-id-login.component';
import { SmartIdLoginDialogComponent } from '../smart-id-login/smart-id-login.component';
import { LocationService } from 'src/app/services/location.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() redirectSuccess?: any;
  userConnections?: any;
  authMethodsAvailable: any;

  LOGIN_PARTNERS = {
    facebook: 'facebook',
    google: 'google'
  };
  email?: string;
  constructor(public dialog: MatDialog,
    private Location: LocationService,
    private config: ConfigService,
    @Inject(Router) private router: Router,
    private UserService: UserService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private Auth: AuthService,
    private translate: TranslateService) {
    this.authMethodsAvailable = this.config.get('features').authentication;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(value => {
      this.userConnections = value['userConnections'];
      this.email = value['email'];
      this.redirectSuccess = this.redirectSuccess || value['redirectSuccess'];
      if (value['userId']) {
        this.UserService.listUserConnections(value['userId'])
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              Object.keys(this.authMethodsAvailable).forEach((method) => {
                this.authMethodsAvailable[method] = false;
                res.rows.forEach((availableMethod: any) => {
                  if (availableMethod.connectionId === method) {
                    this.authMethodsAvailable[method] = true;
                  }
                })
              });
            }, error: (err) => {
              // If the UserConnection fetch fails, it does not matter, we just don't filter authentication methods
              console.warn('Unable to fetch UserConnections for User', err);
            }
          });
      }
      if (this.userConnections) {
        let userAuthMethods = <any[]>['citizenos'];

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
    });
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

  /**
   * Login with Estonian ID-Card
   */
  doLoginEsteId() {
    if (this.router.url.indexOf('account/login') > -1) {
      return this.router.navigate(['estid'], { relativeTo: this.route })
    }

    return this.dialog.open(EstIdLoginDialogComponent, { data: { redirectSuccess: this.redirectSuccess } });
    /*
    this.dialog.open(EstIdLoginComponent, {});*/
  };

  /**
   * Login with Smart-ID
   */
  doLoginSmartId() {
    if (this.router.url.indexOf('account/login') > -1) {
      return this.router.navigate(['smartid'], { relativeTo: this.route })
    }
    return this.dialog.open(SmartIdLoginDialogComponent, { data: { redirectSuccess: this.redirectSuccess } });
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

    const redirectSuccess = this.redirectSuccess || this.Location.getAbsoluteUrl(`${this.translate.currentLang}/dashboard`); // Final url to land after successful login

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
    window.location.href = url;
  };

}


@Component({
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent extends LoginComponent{
  private authSubscriber: Subscription;

  data:any = inject(MAT_DIALOG_DATA);
  logindialog:any = inject(MatDialogRef<LoginDialogComponent>);
  currentMethod = 'email';
  constructor(dialog: MatDialog,
    Location: LocationService,
    config: ConfigService,
    router: Router,
    UserService: UserService,
    route: ActivatedRoute,
    Auth: AuthService,
    translate: TranslateService) {
    super(dialog, Location, config, router, UserService, route, Auth, translate);
    this.authMethodsAvailable = config.get('features').authentication;
    this.authSubscriber = Auth.loggedIn$.subscribe({
      next: (value) => {
        if (value) {
          this.logindialog.close()
        }
      }
    });

    if (this.data.redirectSuccess) {
      this.redirectSuccess = this.data.redirectSuccess;
    }

    console.log(this.currentMethod);
  }

  ngOnDestroy(): void {
    this.authSubscriber.unsubscribe();
  }
}
