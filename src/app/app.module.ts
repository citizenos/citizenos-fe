import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateCompiler, MissingTranslationHandler, TranslateService, TranslateParser } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { MomentModule } from 'ngx-moment';


import { MarkdownService, MarkdownModule } from '@services/markdown.service';
import { ConfigModule, ConfigService } from '@services/config.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpComponent } from './core/components/help/help.component';
import { NavComponent } from './core/components/nav/nav.component';
import { HomeComponent } from './core/components/home/home.component';
import { JSONPointerCompiler, CosMissingTranslationHandler, createTranslateLoader } from './TranslateHandlers';
import { NgxTranslateDebugParser } from 'ngx-translate-debug';
import { LanguageSelectComponent } from './core/components/language-select/language-select.component';
import { ActivityFeedComponent, ActivityFeedDialogComponent } from './core/components/activity-feed/activity-feed.component';
import { SharedModule } from './shared/shared.module';
import { HttpErrorInterceptor } from '@services/http.error.interceptor.service';
import { SearchComponent } from './core/components/search/search.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { PageUnauthorizedComponent } from './core/components/page-unauthorized/page-unauthorized.component';
import { NavMobileComponent } from './core/components/nav-mobile/nav-mobile.component';
import { FeedbackComponent } from './core/components/feedback/feedback.component';
import { CreateComponent } from './core/components/create/create.component';
import { AccessibilityMenuComponent } from './core/components/accessibility-menu/accessibility-menu.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { FeatureBoxComponent } from './core/components/feature-box/feature-box.component';
import { OnboardingComponent } from './core/components/onboarding/onboarding.component';
import { CookieService } from 'ngx-cookie-service';

/*Needs update to also properly load config */
export function appInitializerFactory(translate: TranslateService) {
  return () => {
    translate.setDefaultLang('en');
    return translate.use('en');
  };
}

@NgModule({ declarations: [
        AppComponent,
        HelpComponent,
        NavComponent,
        HomeComponent,
        LanguageSelectComponent,
        ActivityFeedComponent,
        ActivityFeedDialogComponent,
        SearchComponent,
        PageNotFoundComponent,
        PageUnauthorizedComponent,
        NavMobileComponent,
        FeedbackComponent,
        CreateComponent,
        AccessibilityMenuComponent,
        DashboardComponent,
        FeatureBoxComponent,
        OnboardingComponent
    ],
    exports: [],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
            parser: { provide: TranslateParser, useClass: NgxTranslateDebugParser },
            missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CosMissingTranslationHandler },
            compiler: { provide: TranslateCompiler, useClass: JSONPointerCompiler },
        }),
        MomentModule.forRoot({
            relativeTimeThresholdOptions: {
                'm': 59
            }
        }),
        CommonModule,
        AppRoutingModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        LoadingBarHttpClientModule], providers: [
        MarkdownService,
        MarkdownModule.init(),
        ConfigService,
        CookieService,
        ConfigModule.init(),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService],
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi(), withXsrfConfiguration({
            cookieName: 'XSRF-TOKEN',
            headerName: 'X-CSRF-TOKEN'
        }))
    ] })
export class AppModule { }
