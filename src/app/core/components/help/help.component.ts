import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppService } from 'src/app/services/app.service';
import { ConfigService } from 'src/app/services/config.service';

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

  constructor(public sanitizer: DomSanitizer, public app: AppService, private config: ConfigService) { }

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
}
