import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicComponent } from './topic.component';
import { TopicTimelineComponent } from './components/topic-timeline/topic-timeline.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TopicComponent,
    TopicTimelineComponent
  ],
  imports: [
    CommonModule,
    TopicRoutingModule,
    TranslateModule,
  ]
})
export class TopicModule { }
