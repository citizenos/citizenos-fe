import { Component, Inject, HostListener } from '@angular/core';
import { Router, PRIMARY_OUTLET, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

import { MatDialog } from '@angular/material/dialog';
import { AuthService} from './services/auth.service';
import { AppService } from './services/app.service';
import { LocationService } from './services/location.service';
import { NotificationService } from './services/notification.service';
import { ConfigService } from './services/config.service';
import { takeUntil, Subject, tap, map } from 'rxjs';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';
import { NgxTranslateDebugService } from 'ngx-translate-debug';
import { PrivacyPolicyComponent } from 'src/app/account/components/privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  config$ = this.config.load();
  wWidth: number = window.innerWidth;
  destroy$ = new Subject<boolean>();

  private keysPressed = <string[]>[];
  @HostListener('window:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {
    if (this.keysPressed.indexOf(event.key) === -1) this.keysPressed.push(event.key);
    if (this.keysPressed.toString() === 'Control,Alt,Shift,T') this.translateDebug.toggleDebug();
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent) {
    if (this.keysPressed.indexOf(event.key) > -1) this.keysPressed.splice(this.keysPressed.indexOf(event.key), 1);
  }

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private title: Title,
    private Meta: Meta,
    public translate: TranslateService,
    private config: ConfigService,
    private Location: LocationService,
    private Notification: NotificationService,
    private auth: AuthService,
    private dialog: MatDialog,
    private translateDebug: NgxTranslateDebugService,
    public app: AppService) {
    const languageConf = config.get('language');
    translate.addLangs(Object.keys(languageConf.list));
    translate.setDefaultLang(languageConf.default);
    this.setDefaultMetaInfo();
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe
      ((event: Event) => {
        //console.log(event);
        if (event && event instanceof NavigationStart) {
          this.Notification.removeAll(); //Remove all notifications on navigating away
          app.showNav = false;
          app.topic = undefined;
          const parsedUrl = router.parseUrl(event.url);
          const outlet = parsedUrl.root.children[PRIMARY_OUTLET];

          const g = outlet?.segments.map(seg => seg.path) || [''];
          let langParam = g[0];
          if (translate.currentLang !== langParam && translate.getLangs().indexOf(langParam) === -1) {
            g.unshift(translate.currentLang || translate.getBrowserLang() || translate.getDefaultLang());
            this.router.navigate(g, { queryParams: parsedUrl.queryParams, fragment: parsedUrl.fragment || undefined });
          }
          else if (translate.currentLang !== langParam) {
            if (!this.translateDebug.isDebugMode) {
              translate.use(langParam);
              moment.locale(langParam);
            }
          }
        }
        if (event && event instanceof NavigationEnd) {
          this.createRelUrls(event.url);
          this.app.setPageTitle();
        }
      });
    /* Change body class if accessibility settings are changed */
    this.app.accessibility.pipe(
      takeUntil(this.destroy$),
      map((classes: any) => {
        this.document.body.classList.remove(...this.document.body.classList);
        this.document.body.classList.add(classes.contrast);
        if (classes.text) {
          this.document.body.classList.add(classes.text);
        }
      })
    ).subscribe();
    this.auth.user$?.pipe(tap((user) => {
      if (user && !user.termsVersion || user.termsVersion !== this.config.get('legal').version) {
        const tosDialog = this.dialog.open(PrivacyPolicyComponent, {
          data: { user }
        });
      }
    })).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  displaySearch() {
    const parsedUrl = this.router.parseUrl(this.router.url);
    const outlet = parsedUrl.root.children[PRIMARY_OUTLET];

    const g = outlet?.segments.map(seg => seg.path) || [''];
    let langParam = g[0];
    if (langParam === this.translate.currentLang && g[0] === 'topics') return false;
    return true;
  };


  setDefaultMetaInfo() {
    this.title.setTitle(this.translate.instant('META_DEFAULT_TITLE'));
    const tags = <MetaDefinition[]>[
      {
        rel: 'shortcut icon',
        href: this.Location.getAbsoluteUrl('/assets/imgs/favicon.ico'),
        type: 'image/x-icon'
      },
      {
        name: 'keywords',
        content: this.translate.instant('META_DEFAULT_KEYWORDS')
      },
      {
        name: 'description',
        content: this.translate.instant('META_DEFAULT_DESCRIPTION')
      },
      {
        property: 'og:title',
        content: this.translate.instant('META_DEFAULT_TITLE')
      },
      {
        property: 'og:image',
        content: this.Location.getAbsoluteUrl('/assets/imgs/logo_dark_seo.jpg'),
      },
      {
        property: 'og:description',
        content: this.translate.instant('META_DEFAULT_DESCRIPTION')
      },
      {
        property: 'og:url',
        content: this.Location.currentUrl()
      },
      {
        property: 'og:site_name',
        content: 'CitizenOS.com'
      },
    ]

    this.Meta.addTags(tags);
  };

  createRelUrls(url: string) {
    this.translate.getLangs().forEach((language) => {
      const urlItem = url.split('/');
      urlItem[1] = language;
      let link: HTMLLinkElement = this.document.createElement('link');
      const linkTags = this.document.querySelectorAll(`link[hreflang=${language}]`);
      if (linkTags.length) {
        link = <HTMLLinkElement>linkTags[0];
      } else {
        this.document.head.appendChild(link);
      }
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', language);
      link.setAttribute('href', this.Location.getAbsoluteUrl(urlItem.join('/')));
    });
  };
}