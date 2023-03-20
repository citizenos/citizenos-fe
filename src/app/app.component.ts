import { Component } from '@angular/core';
import { Router, PRIMARY_OUTLET, Event, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from "@angular/platform-browser";

import { AppService } from './services/app.service';
import { ConfigService } from './services/config.service';
import { takeUntil, Subject, tap } from 'rxjs';
import * as moment  from 'moment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  config$ = this.config.load();
  wWidth: number = window.innerWidth;
  destroy$ = new Subject<boolean>();
  constructor(private router: Router, private title: Title, public translate: TranslateService, private config: ConfigService, public app: AppService) {
    const languageConf = config.get('language');
    translate.addLangs(Object.keys(languageConf.list));
    translate.setDefaultLang(languageConf.default);
    translate.onTranslationChange.pipe(
      tap((event) => { this.title.setTitle(translate.instant('META_DEFAULT_TITLE')); })
    );
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe
      ((event: Event) => {
        if (event && event instanceof NavigationStart) {
          app.showNav = false;
          app.topic = undefined;
          const parsedUrl = router.parseUrl(event.url);
          const outlet = parsedUrl.root.children[PRIMARY_OUTLET];

          const g = outlet?.segments.map(seg => seg.path) || [''];
          let langParam = g[0];
          if (translate.currentLang !== langParam && translate.getLangs().indexOf(langParam) === -1) {
            g.unshift(translate.currentLang || translate.getBrowserLang() || translate.getDefaultLang());
            this.router.navigate(g, { queryParams: parsedUrl.queryParams, fragment: parsedUrl.fragment || undefined });
          } else if (translate.currentLang !== langParam) {
            translate.use(langParam);
            moment.locale(langParam);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  displaySearch () {
    const parsedUrl = this.router.parseUrl(this.router.url);
    const outlet = parsedUrl.root.children[PRIMARY_OUTLET];

    const g = outlet?.segments.map(seg => seg.path) || [''];
    let langParam = g[0];
    if (langParam === this.translate.currentLang && g[0] === 'topics') return false;
    return true;
  };
}

