import { DialogService } from 'src/app/shared/dialog';
import { ConfigService } from 'src/app/services/config.service';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectComponent } from '../language-select/language-select.component';
import { AccessibilityMenuComponent } from '../accessibility-menu/accessibility-menu.component';

import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { AppService } from 'src/app/services/app.service';
import { TourService } from 'src/app/services/tour.service';
import { TopicService } from 'src/app/services/topic.service';
import { Observable, take, of, switchMap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavComponent implements OnInit {
  wWidth = window.innerWidth;
  topicsCount$ = this.TopicService.count();
  showNavCreate = false;
  extraInfo = false;
  helpExtraInfo$: Observable<boolean>;
  constructor(private Location: LocationService,
    public translate: TranslateService,
    private router: Router,
    public config: ConfigService,
    public auth: AuthService,
    public dialog: DialogService,
    public app: AppService,
    private TopicService: TopicService,
    public TourService: TourService
  ) {
    this.helpExtraInfo$ = this.router.events.pipe(switchMap((event) => {
      if (event instanceof NavigationEnd) {
        this.extraInfo = false;
        const url = event.url;
        if (url.indexOf('/topics/') > -1 && url.indexOf('/create/') === -1 && url.indexOf('/edit/') === -1) {
          this.extraInfo = true;
        }
      }

      return of(this.extraInfo);
    }))
  }

  ngOnInit(): void {
  }

  isNavVisible() {
    if (this.app.showNav) {
      window.scrollTo(0, 0);
    }
  }

  displayEmpoweredIcon() {
    if (!/citizenos\.com/.test(this.Location.getBaseUrl())) {
      return true;
    }

    return false;
  };

  doShowLanguageSelect() {
    this.dialog.closeAll();
    this.dialog.open(LanguageSelectComponent);
  }

  doShowLogin() {
    this.app.doShowLogin();
  }

  doShowRegister() {
    this.app.doShowRegister();
  }

  doLogout() {
    this.auth.logout()
      .pipe(take(1))
      .subscribe({
        next: (done) => {
          console.log('SUCCESS', done);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('LOGOUT ERROR', err);
        }
      });
  }
  toggleHelp() {
    const curStatus = this.app.showHelp.getValue();
    this.app.showHelp.next(!curStatus);
  }

  accessibility() {
    this.dialog.closeAll();
    this.dialog.open(AccessibilityMenuComponent);
  }

  showCreateMenu() {
    if (window.innerWidth <= 1024) {
      return this.showNavCreate = !this.showNavCreate;
    }
    return this.app.showCreateMenu();
  }

  toggleNav() {
    this.app.showNav = !this.app.showNav;
    if (window.innerWidth <= 1024 && window.innerWidth > 560) {
      this.app.tabletNav = this.app.showNav;
    }
  }
}
