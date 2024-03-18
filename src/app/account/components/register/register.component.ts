import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { LocationService } from 'src/app/services/location.service';
import { DialogService } from 'src/app/shared/dialog';
import { EstIdLoginDialogComponent } from '../est-id-login/est-id-login.component';
import { SmartIdLoginDialogComponent } from '../smart-id-login/smart-id-login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  redirectSuccess?: any;
  email?: string;
  authMethodsAvailable: any;
  LOGIN_PARTNERS = {
    facebook: 'facebook',
    google: 'google'
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private Location: LocationService,
    private translate: TranslateService,
    private Auth: AuthService,
    private dialog: DialogService,
    private config: ConfigService) {
    this.authMethodsAvailable = config.get('features').authentication;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(value => {
      this.email = value['email'];
      this.redirectSuccess = this.redirectSuccess || value['redirectSuccess'];
      if (!this.redirectSuccess) {
        this.redirectSuccess = this.Location.getAbsoluteUrl(`/account/login`);
      }
    });
  }

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
          console.log('HERE', redirectSuccess);
          this.Auth.user$
            .subscribe((user) => {
              if (user) {
                console.log('HERE')
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
}

@Component({
  templateUrl: './register-dialog.component.html'
})
export class RegisterDialogComponent {
  redirectSuccess?: any;
  email?: string;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(value => {
      this.email = value['email'];
      this.redirectSuccess = this.redirectSuccess || value['redirectSuccess'];
    });
  }
}
