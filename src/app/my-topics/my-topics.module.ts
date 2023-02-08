import { MyTopicsComponent } from './my-topics.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTopicsRoutingModule } from './my-topics.router.module';
import { ListComponent } from './components/list/list.component';
import { MyTopicComponent } from './components/my-topic/my-topic.component';
import { TopicListItemComponent } from './components/topic-list-item/topic-list-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TopicInviteComponent, TopicInviteDialogComponent } from '../topic/components/topic-invite/topic-invite.component';
import { TopicShareComponent } from 'src/app/topic/components/topic-share/topic-share.component';

@NgModule({
  declarations: [
    MyTopicsComponent,
    ListComponent,
    MyTopicComponent,
    TopicListItemComponent,
    TopicInviteComponent,
    TopicInviteDialogComponent,
    TopicShareComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MyTopicsRoutingModule,
    TranslateModule
  ],
  exports: [],
})
export class MyTopicsModule { }
