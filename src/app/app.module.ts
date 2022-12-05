import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { LanguageSelectComponent } from './core/components/language-select/language-select.component';
import { NotificationComponent } from './core/components/notification/notification.component';
import { TopicboxComponent } from './core/components/topicbox/topicbox.component';
import { CategoryboxComponent } from './core/components/categorybox/categorybox.component';

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
    TopicboxComponent,
    CategoryboxComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
    }
    }),
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ConfigService,
    ConfigModule.init(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
