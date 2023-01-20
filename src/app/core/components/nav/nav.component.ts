import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from 'src/app/services/config.service';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectComponent } from '../language-select/language-select.component';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../account/login/login.component';
import { ActivityFeedComponent } from '../activity-feed/activity-feed.component';
import { AppService } from 'src/app/services/app.service';
import { ActivityService } from 'src/app/services/activity.service';
@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class NavComponent implements OnInit {
  wWidth = window.innerWidth;
  unreadActivitiesCount$: any;
  constructor(private path: LocationStrategy,
    public translate: TranslateService,
    public config: ConfigService,
    public auth: AuthService, public dialog: MatDialog,
    private app: AppService,
    private ActivityService: ActivityService
  ) {
    this.unreadActivitiesCount$ = ActivityService.getUnreadActivities();
  }

  ngOnInit(): void {
  }

  displayEmpoweredIcon() {
    if (!/citizenos\.com/.test(this.path.getBaseHref())) {
      return true;
    }

    return false;
  };

  doShowLanguageSelect() {
    this.dialog.open(LanguageSelectComponent);
  }

  doShowLogin() {
    this.dialog.open(LoginComponent);
  }

  doLogout() {
    this.auth.loggedIn$.next(false);
  }
  toggleHelp() {
    const curStatus = this.app.showHelp.getValue();
    this.app.showHelp.next(!curStatus);
  }

  doShowActivityModal() {
    const dialog = this.dialog.open(ActivityFeedComponent);

  };
}
