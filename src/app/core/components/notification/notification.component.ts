import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NotificationService } from 'src/app/services/notification.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  showTestingEnvNotification: boolean = false;
  constructor(public notifications: NotificationService, @Inject(DOCUMENT) private document: any, private changeDetection: ChangeDetectorRef, private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    this.showTestingEnvNotification = (this.document.location.hostname === 'dev.citizenos.com');
    this.changeDetection.detectChanges();
  }

  trackByIndex(index: number): number {
    return index;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if(this.showTestingEnvNotification) {
      setTimeout(() => {
        this.notifications.addWarning('PLEASE NOTE! This Citizen OS is a testing environment and is for TESTING ONLY, all data here MAY be deleted at any time! Please visit <a href="https://app.citizenos.com">https://app.citizenos.com</a> for LIVE application.');
      }, 1000)
    }
  }
}
