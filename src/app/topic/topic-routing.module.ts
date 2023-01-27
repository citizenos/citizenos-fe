import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicSettingsDialogComponent } from './components/topic-settings-dialog/topic-settings-dialog.component';
import { TopicComponent } from './topic.component';

const routes: Routes = [
  {path: '', children: [
    {path: ':topicId', component: TopicComponent, children: [
      {path: 'votes', children: [
        {path: ':voteId', component: TopicComponent}
      ]},
      {path: 'settings', component: TopicSettingsDialogComponent},
      {path: '', component: TopicComponent},
    ]},
    {path: '', component: TopicComponent},
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule { }
