import { MyTopicsComponent } from './my-topics.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTopicsRoutingModule } from './my-topics.router.module';
import { ListComponent } from './components/list/list.component';
import { MyTopicComponent } from './components/my-topic/my-topic.component';
import { TopicListItemComponent } from './components/topic-list-item/topic-list-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from '../directives/tooltip';


@NgModule({
  declarations: [
    TooltipDirective,
    MyTopicsComponent,
    ListComponent,
    MyTopicComponent,
    TopicListItemComponent
  ],
  imports: [
    CommonModule,
    MyTopicsRoutingModule,
    TranslateModule
  ],
  exports: [TooltipDirective],
})
export class MyTopicsModule { }
