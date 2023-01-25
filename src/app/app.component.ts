import { Component } from '@angular/core';
import { Router, PRIMARY_OUTLET, Event, NavigationStart, ActivatedRoute, UrlSerializer } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from "@angular/platform-browser";

import { ConfigService } from './services/config.service';
import { takeUntil, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  config$ = this.config.load();
  wWidth: number = window.innerWidth;
  destroy$ = new Subject<boolean>();
  constructor(private router: Router, route: ActivatedRoute, private title: Title, public translate: TranslateService, private config: ConfigService) {
    const languageConf = config.get('language');
    translate.addLangs(Object.keys(languageConf.list));
    translate.setDefaultLang(languageConf.default);
    translate.onTranslationChange.pipe(
      tap((event) => { this.title.setTitle(translate.instant('META_DEFAULT_TITLE')); })
    );
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe
      ((event: Event) => {
        if (event && event instanceof NavigationStart) {
          const parsedUrl = router.parseUrl(event.url);
          const outlet = parsedUrl.root.children[PRIMARY_OUTLET];

          const g = outlet?.segments.map(seg => seg.path) || [''];
          let langParam = g[0];
          if (translate.currentLang !== langParam && translate.getLangs().indexOf(langParam) === -1) {
            g.unshift(translate.currentLang || translate.getBrowserLang() || translate.getDefaultLang());
            this.router.navigate(g, { queryParams: parsedUrl.queryParams, fragment: parsedUrl.fragment || undefined });
          } else if (translate.currentLang !== langParam) {
            translate.use(langParam);
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

