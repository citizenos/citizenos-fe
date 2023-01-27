import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkyModule } from 'angular2-linky';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicComponent } from './topic.component';
import { TopicTimelineComponent } from './components/topic-timeline/topic-timeline.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TopicArgumentsComponent } from './components/topic-arguments/topic-arguments.component';
import { ArgumentComponent } from './components/argument/argument.component';
import { TopicNotificationSettingsComponent } from './components/topic-notification-settings/topic-notification-settings.component';
import { VoteClosedComponent } from './components/vote-closed/vote-closed.component';
import { TopicTabsComponent } from './components/topic-tabs/topic-tabs.component';
import { TopicSidepanelComponent } from './components/topic-sidepanel/topic-sidepanel.component';


@NgModule({
  declarations: [
    TopicComponent,
    TopicTimelineComponent,
    TopicArgumentsComponent,
    ArgumentComponent,
    TopicNotificationSettingsComponent,
    VoteClosedComponent,
    TopicTabsComponent,
    TopicSidepanelComponent,
  ],
  imports: [
    CommonModule,
    LinkyModule,
    SharedModule,
    TopicRoutingModule,
    TranslateModule,
  ]
})
export class TopicModule { }
