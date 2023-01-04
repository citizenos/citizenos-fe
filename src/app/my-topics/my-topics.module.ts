import { MyTopicsComponent } from './my-topics.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTopicsRoutingModule } from './my-topics.router.module';
import { ListComponent } from './components/list/list.component';
import { MyTopicComponent } from './components/my-topic/my-topic.component';
import { TopicListItemComponent } from './components/topic-list-item/topic-list-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MyTopicsComponent,
    ListComponent,
    MyTopicComponent,
    TopicListItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MyTopicsRoutingModule,
    TranslateModule
  ],
  exports: [],
})
export class MyTopicsModule { }
