import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicInviteDialogComponent } from '../my-topics/components/topic-invite-dialog/topic-invite-dialog.component';
import { TopicAttachmentsDialogComponent } from './components/topic-attachments-dialog/topic-attachments-dialog.component';
import { TopicCreateComponent } from './components/topic-create/topic-create.component';
import { TopicParticipantsDialogComponent } from './components/topic-participants-dialog/topic-participants-dialog.component';
import { TopicReportFormDialogComponent } from './components/topic-report-form-dialog/topic-report-form-dialog.component';
import { TopicReportModerateDialogComponent } from './components/topic-report-moderate-dialog/topic-report-moderate-dialog.component';
import { TopicReportResolveDialogComponent } from './components/topic-report-resolve-dialog/topic-report-resolve-dialog.component';
import { TopicReportReviewDialogComponent } from './components/topic-report-review-dialog/topic-report-review-dialog.component';
import { TopicSettingsDialogComponent } from './components/topic-settings-dialog/topic-settings-dialog.component';
import { TopicComponent } from './topic.component';

const routes: Routes = [
    {path: 'create', component: TopicCreateComponent},
    {path: ':topicId', component: TopicComponent, children: [
      {path: 'invite', component: TopicInviteDialogComponent },
      {path: 'followup', component: TopicComponent},
      {path: 'votes', children: [
        {path: 'create', component: TopicComponent},
        {path: ':voteId', component: TopicComponent}
      ]},
      {path: 'settings', component: TopicSettingsDialogComponent},
      {path: 'files', component: TopicAttachmentsDialogComponent},
      {path: 'participants', component: TopicParticipantsDialogComponent},
      {path: 'report', component: TopicReportFormDialogComponent},
      {path: 'report/:reportId/moderate', component: TopicReportModerateDialogComponent},
      {path: 'report/:reportId/review', component: TopicReportReviewDialogComponent},
      {path: 'report/:reportId/resolve', component: TopicReportResolveDialogComponent},
      {path: '', component: TopicComponent},
    ]},
    {path: '', component: TopicComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule { }
