import { Component } from '@angular/core';
import { Router, Event, ActivatedRoute, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from './services/config.service';
import { NotificationService } from './services/notification.service';
import { takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  config$ = this.config.load();
  wWidth: number = window.innerWidth;
  destroy$ = new Subject<boolean>();
  constructor (private router: Router, private route: ActivatedRoute, public translate: TranslateService, private config: ConfigService) {
    const languageConf = config.get('language');
    translate.addLangs(Object.keys(languageConf.list));
    translate.setDefaultLang(languageConf.default);
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe
      ((event: Event) => {
        if (event instanceof NavigationStart) {
            if (event) {
              const urlDelimitators = new RegExp(/[?//,;&:#$+=]/);
              let langParam = event.url.slice(1).split(urlDelimitators)[0];
              if( translate.currentLang !== langParam && translate.getLangs().indexOf(langParam) === -1) {
                const path = `${translate.currentLang || translate.getBrowserLang() || translate.getDefaultLang()}${event.url}`
                this.router.navigate([path]);
              } else if (translate.currentLang !== langParam){
                translate.use(langParam);
              }
            }
        }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  displaySearch = () => {
    const allowedState = ['home', 'my/groups', 'my/topics', 'public/groups', 'public/groups/view', 'my/groups/groupId', 'my/topics/topicId'];
    if (allowedState.indexOf(this.router.url) > -1) {
        return true;
    }

    return false;
  };
}

