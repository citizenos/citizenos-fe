import { Component, Inject, HostListener } from '@angular/core';
import { Router, PRIMARY_OUTLET, Event, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from "@angular/platform-browser";

import { AppService } from './services/app.service';
import { ConfigService } from './services/config.service';
import { takeUntil, Subject, tap, map } from 'rxjs';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgxTranslateDebugService } from 'ngx-translate-debug';

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
    console.log(this.keysPressed.toString())
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
    public translate: TranslateService,
    private config: ConfigService,
    private translateDebug: NgxTranslateDebugService,
    public app: AppService) {
    const languageConf = config.get('language');
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
          }
          else if (translate.currentLang !== langParam) {
            if (!this.translateDebug.isDebugMode) {
              translate.use(langParam);
              moment.locale(langParam);
            }
          }
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
}

