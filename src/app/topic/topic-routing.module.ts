import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicInviteDialogComponent } from 'src/app/topic/components/topic-invite/topic-invite.component';
import { TopicAttachmentsDialogComponent } from './components/topic-attachments/topic-attachments.component';
import { TopicCreateComponent } from './components/topic-create/topic-create.component';
import { TopicParticipantsDialogComponent } from './components/topic-participants/topic-participants.component';
import { TopicReportFormDialogComponent } from './components/topic-report-form/topic-report-form.component';
import { TopicReportModerateDialogComponent } from './components/topic-report-moderate/topic-report-moderate.component';
import { TopicReportResolveDialogComponent } from './components/topic-report-resolve/topic-report-resolve.component';
import { TopicReportReviewDialogComponent } from './components/topic-report-review/topic-report-review.component';
import { TopicSettingsDialogComponent } from './components/topic-settings/topic-settings.component';
import { TopicComponent } from './topic.component';

const routes: Routes = [
  { path: 'create', component: TopicCreateComponent },
  {
    path: ':topicId', component: TopicComponent, children: [
      { path: 'invite', component: TopicInviteDialogComponent },
      { path: 'followup', component: TopicComponent },
      {
        path: 'votes', children: [
          { path: 'create', component: TopicComponent },
          { path: ':voteId', component: TopicComponent }
        ]
      },
      { path: 'settings', component: TopicSettingsDialogComponent },
      { path: 'files', component: TopicAttachmentsDialogComponent },
      { path: 'participants', component: TopicParticipantsDialogComponent },
      { path: 'report', component: TopicReportFormDialogComponent },
      { path: 'report/:reportId/moderate', component: TopicReportModerateDialogComponent },
      { path: 'report/:reportId/review', component: TopicReportReviewDialogComponent },
      { path: 'report/:reportId/resolve', component: TopicReportResolveDialogComponent },
      { path: '', component: TopicComponent },
    ]
  },
  { path: '', component: TopicComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule { }
