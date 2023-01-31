import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateLoader, TranslateCompiler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { MomentModule } from 'ngx-moment';


import { MarkdownService, MarkdownModule } from './services/markdown.service';
import { ConfigModule, ConfigService } from './services/config.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpComponent } from './core/components/help/help.component';
import { NavComponent } from './core/components/nav/nav.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './core/components/account/login/login.component';
import { LoginDialogComponent } from './core/components/account/login/loginDialog';
import { HomeComponent } from './core/components/home/home.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import {} from '@ngx-translate/core';
import { JSONPointerCompiler } from './JSONPointerCompiler';
import { LanguageSelectComponent } from './core/components/language-select/language-select.component';
import { NotificationComponent } from './core/components/notification/notification.component';
import { ActivityFeedComponent } from './core/components/activity-feed/activity-feed.component';
import { SharedModule } from './shared/shared.module';
import { HttpErrorInterceptor } from './services/http.error.interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    NavComponent,
    LoginComponent,
    LoginDialogComponent,
    HomeComponent,
    LanguageSelectComponent,
    NotificationComponent,
    ActivityFeedComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      compiler: {provide: TranslateCompiler, useClass: JSONPointerCompiler},
    }),
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    }),
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LoadingBarHttpClientModule
  ],
  exports: [
    MatSelectModule
  ],
  providers: [
    MarkdownService,
    MarkdownModule.init(),
    ConfigService,
    ConfigModule.init(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
