import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { ConfigService } from 'src/app/services/config.service';
import { LocationService } from 'src/app/services/location.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TourService } from 'src/app/services/tour.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  @ViewChild('helpFrame') helpFrame?: ElementRef;
  public helptooltip = false;
  public helpUrl = 'https://citizenos.com/help?app=true';
  public urlSafe: SafeResourceUrl = 'https://citizenos.com/help?app=true';
  public showTourBox = false;

  helpForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    description: new UntypedFormControl('', Validators.required),
  });

  constructor(
    public sanitizer: DomSanitizer,
    public app: AppService,
    private config: ConfigService,
    private TourService: TourService,
    private router: Router,
    private Location: LocationService,
    private Notification: NotificationService,
    private http: HttpClient
  ) {
    this.app.showHelp.pipe(tap((show) => {
      const url = this.router.url;
      this.showTourBox = false;
      if (window.innerWidth <= 1024 && show && url.indexOf('/topics/') > -1 && url.indexOf('/create/') === -1 && url.indexOf('/edit/') === -1) {
        this.showTourBox = true;
      }

    })).subscribe();
  }

  ngOnInit(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.config.get('helplink') || this.helpUrl);
  }

  toggleHelp() {
    const curStatus = this.app.showHelp.getValue();
    this.app.showHelp.next(!curStatus);
  };

  toggleHelpTooltip() {
    this.helptooltip = true;
  };

  closeTootlip() {
    this.helptooltip = false;
    /*  this.app.helpBubbleAnimate();*/
  }

  helpback() {
    try {
      const helpDomain = new URL(this.config.get('helplink') || this.helpUrl);
      console.log('HELPFRAME', this.helpFrame, this.helpFrame?.nativeElement.contentWindow.postMessage);
      this.helpFrame?.nativeElement.contentWindow.postMessage('back', helpDomain.origin);
    } catch (err) {
      if (this.helpFrame) {
        this.helpFrame.nativeElement.src = this.helpFrame.nativeElement.src;
      }
    }
  }

  startTour() {
    this.toggleHelp();
    window.scrollTo(0, 0);
    if (window.innerWidth > 560) {
      return this.TourService.show('topic_tablet', 1);
    }
    this.TourService.show('topic_mobile', 1);
  }

  sendHelpRequest() {
    if (!this.helpForm.invalid) {
      let path = this.Location.getAbsoluteUrlApi('/api/internal/help');
      let mailData = Object.assign(this.helpForm.value,{
        userAgent: window.navigator.userAgent,
        // @ts-ignore:next-line
        platform: window.navigator.platform || window.navigator.userAgentData?.platform,
        height: window.innerHeight,
        width: window.innerWidth,
        location: this.Location.currentUrl()
      });
      this.http.post(path, mailData, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
        take(1),
      ).subscribe({
        next: (res) => {
          this.helpForm.reset();
          this.toggleHelp();
          this.Notification.addSuccess('HELP_WIDGET.MSG_REQUEST_SENT');
        },
        error: (err) => {
          console.error(err);
          this.Notification.addError(err.message);
        }
      });
    }
  }
}
