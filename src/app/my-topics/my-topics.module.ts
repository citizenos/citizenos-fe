import { MyTopicsComponent } from './my-topics.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTopicsRoutingModule } from './my-topics.router.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TopicInviteComponent, TopicInviteDialogComponent } from '../topic/components/topic-invite/topic-invite.component';
import { TopicShareComponent } from 'src/app/topic/components/topic-share/topic-share.component';

@NgModule({
  declarations: [
    MyTopicsComponent,
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
