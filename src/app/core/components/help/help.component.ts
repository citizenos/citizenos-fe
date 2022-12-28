import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  public helptooltip = false;
  public helpUrl = 'https://citizenos.com/help?app=true';
  public urlSafe: SafeResourceUrl = 'https://citizenos.com/help?app=true';

  constructor(public sanitizer: DomSanitizer, public app: AppService) { }

  ngOnInit(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.helpUrl);
    console.log(this.urlSafe);
  }

  toggleHelp () {
    const curStatus  = this.app.showHelp.getValue();
    this.app.showHelp.next(!curStatus);
  };

  toggleHelpTooltip () {
      this.helptooltip = true;
  };

  closeTootlip () {
      this.helptooltip = false;
    /*  this.app.helpBubbleAnimate();*/
  }

  helpback () {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.helpUrl);
  }
}
