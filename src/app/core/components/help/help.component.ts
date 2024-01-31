import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { ConfigService } from 'src/app/services/config.service';
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
  constructor(public sanitizer: DomSanitizer, public app: AppService, private config: ConfigService, private TourService: TourService, private router: Router) {
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
      this.helpFrame?.nativeElement.contentWindow.postMessage('back', helpDomain.origin);
    } catch (err) {
      if (this.helpFrame)
        this.helpFrame.nativeElement.src = this.helpFrame.nativeElement.src;
    }
  }

  startTour () {
    this.toggleHelp();
    window.scrollTo(0, 0);
    if (window.innerWidth > 560) {
      return this.TourService.show('topic_tablet', 1);
    }
    this.TourService.show('topic_mobile', 1);
  }
}
