import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicInviteDialogComponent } from 'src/app/topic/components/topic-invite/topic-invite.component';
import { ArgumentReportModerateDialogComponent } from './components/argument-report-moderate/argument-report-moderate.component';
import { TopicAttachmentsDialogComponent } from './components/topic-attachments/topic-attachments.component';
import { TopicCreateComponent } from './components/topic-create/topic-create.component';
import { TopicInvitationDialogComponent } from './components/topic-invitation/topic-invitation.component';
import { TopicJoinComponent } from './components/topic-join/topic-join.component';
import { TopicParticipantsDialogComponent } from './components/topic-participants/topic-participants.component';
import { TopicReportFormDialogComponent } from './components/topic-report-form/topic-report-form.component';
import { TopicReportModerateDialogComponent } from './components/topic-report-moderate/topic-report-moderate.component';
import { TopicReportResolveDialogComponent } from './components/topic-report-resolve/topic-report-resolve.component';
import { TopicReportReviewDialogComponent } from './components/topic-report-review/topic-report-review.component';
import { TopicSettingsDialogComponent } from './components/topic-settings/topic-settings.component';
import { TopicComponent } from './topic.component';

const routes: Routes = [
  { path: 'create', component: TopicCreateComponent },
  { path: ':topicId/invites/users/:inviteId', component: TopicInvitationDialogComponent },
  {
    path: ':topicId', component: TopicComponent, children: [
      { path: 'invite', component: TopicInviteDialogComponent },
      { path: 'followup' },
      {
        path: 'votes', children: [
          { path: 'create', },
          { path: ':voteId', children: [
            { path: 'followup'},
          ]}
        ]
      },
      { path: 'settings', component: TopicSettingsDialogComponent },
      { path: 'files', component: TopicAttachmentsDialogComponent },
      { path: 'participants', component: TopicParticipantsDialogComponent },
      { path: 'report', component: TopicReportFormDialogComponent },
      { path: 'reports/:reportId/moderate', component: TopicReportModerateDialogComponent },
      { path: 'reports/:reportId/review', component: TopicReportReviewDialogComponent },
      { path: 'reports/:reportId/resolve', component: TopicReportResolveDialogComponent },
      { path: 'comments/:commentId/reports/:reportId/moderate', component: ArgumentReportModerateDialogComponent},
    ]
  },
  {path: 'join/:token', component: TopicJoinComponent},//https://dev.citizenos.com:3001/topics/join/XwBvIs29gwrH
  { path: '', component: TopicComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule { }
