import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from 'src/app/services/config.service';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectComponent } from '../language-select/language-select.component';
import { AccessibilityMenuComponent } from '../accessibility-menu/accessibility-menu.component';

import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { AppService } from 'src/app/services/app.service';
import { take } from 'rxjs';
@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavComponent implements OnInit {
  wWidth = window.innerWidth;
  constructor(private Location: LocationService,
    public translate: TranslateService,
    public config: ConfigService,
    public auth: AuthService, public dialog: MatDialog,
    public app: AppService
  ) {
  }

  ngOnInit(): void {
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
      },
      error: (err) => {
        console.log('ERROR', err);
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
}
