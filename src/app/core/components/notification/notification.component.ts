import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  showTestingEnvNotification: boolean = false;
  constructor(public notifications: NotificationService, @Inject(DOCUMENT) private document: any, private changeDetection: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.showTestingEnvNotification = (this.document.location.hostname === 'test.app.citizenos.com');
    this.changeDetection.detectChanges();
  }

  trackByIndex(index: number): number {
    return index;
  }
}
