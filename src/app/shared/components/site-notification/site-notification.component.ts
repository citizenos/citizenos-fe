import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '@services/config.service';

import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'site-notification',
  templateUrl: './site-notification.component.html',
  styleUrl: './site-notification.component.scss',
  standalone: false
})
export class SiteNotificationComponent {
  public showNotification = false;
  constructor(
    private readonly config: ConfigService,
    private readonly CookieService: CookieService,
    private readonly translate: TranslateService,
    private readonly Notification: NotificationService) {
      if (this.config.get('showIssueNotification') && !this.CookieService.get('show-issue-notification')) {
        this.showNotification = true;
      }
  }

  close() {
    this.showNotification = false;
    this.CookieService.set('show-issue-notification', 'true', 36500);
  }
}
