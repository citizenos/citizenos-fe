import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicComponent } from './topic.component';
import { TopicTimelineComponent } from './components/topic-timeline/topic-timeline.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TopicArgumentsComponent } from './components/topic-arguments/topic-arguments.component';
import { ArgumentComponent } from './components/argument/argument.component';

@NgModule({
  declarations: [
    TopicComponent,
    TopicTimelineComponent,
    TopicArgumentsComponent,
    ArgumentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TopicRoutingModule,
    TranslateModule,
  ]
})
export class TopicModule { }
