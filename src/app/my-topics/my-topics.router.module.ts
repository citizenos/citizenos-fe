import { MyTopicComponent } from './components/my-topic/my-topic.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTopicsComponent } from './my-topics.component';
import { TopicInviteDialogComponent } from './components/topic-invite-dialog/topic-invite-dialog.component';

const routes: Routes = [
  {
    path: '', component: MyTopicsComponent, children: [
      {
        path: ':topicId', children: [
          { path: '', component: MyTopicComponent,  outlet: 'mytopicsright' },
          { path: 'invite', children: [
             {path: '', component: TopicInviteDialogComponent }
          ]},
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTopicsRoutingModule {
  constructor() {
  }
}
