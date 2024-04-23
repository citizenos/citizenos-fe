import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanDeactivate } from '@angular/router';
import { TopicInviteDialogComponent } from 'src/app/topic/components/topic-invite/topic-invite.component';
import { ArgumentReportModerateDialogComponent } from './components/argument-report-moderate/argument-report-moderate.component';
import { TopicAttachmentsDialogComponent } from './components/topic-attachments/topic-attachments.component';
import { TopicCreateComponent } from './components/topic-create/topic-create.component';
import { TopicEditComponent } from './components/topic-edit/topic-edit.component';
import { TopicInvitationDialogComponent } from './components/topic-invitation/topic-invitation.component';
import { TopicTokenJoinComponent } from './components/topic-join/topic-join.component';
import { TopicParticipantsDialogComponent } from './components/topic-participants/topic-participants.component';
import { TopicReportFormDialogComponent } from './components/topic-report-form/topic-report-form.component';
import { TopicReportModerateDialogComponent } from './components/topic-report-moderate/topic-report-moderate.component';
import { TopicReportResolveDialogComponent } from './components/topic-report-resolve/topic-report-resolve.component';
import { TopicReportReviewDialogComponent } from './components/topic-report-review/topic-report-review.component';
import { TopicComponent } from './topic.component';
import { VoteCreateComponent } from '../voting/components/vote-create/vote-create.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { CanDeactivateBlockNavigationIfChange } from '../shared/pending-changes.guard';
import { IdeationCreateComponent } from '../ideation/components/ideation-create/ideation-create.component';
import { IdeaComponent } from '../ideation/components/idea/idea.component';
import { IdeaReportModerateDialogComponent } from '../ideation/components/idea-report-moderate/idea-report-moderate.component';

const routes: Routes = [
  {
    path: 'create', canActivate: [AuthGuard], children: [
      { path: '', component: TopicCreateComponent, canDeactivate: [CanDeactivateBlockNavigationIfChange] },
      { path: ':topicId', component: TopicCreateComponent, canDeactivate: [CanDeactivateBlockNavigationIfChange], }
    ]
  },
  {
    path: 'edit', canActivate: [AuthGuard], children: [
      { path: ':topicId', component: TopicEditComponent, canDeactivate: [CanDeactivateBlockNavigationIfChange] }
    ]
  },
  {
    path: 'vote', children: [
      {
        path: 'create', canActivate: [AuthGuard], children: [
          { path: '', component: VoteCreateComponent },
          { path: ':topicId', component: VoteCreateComponent, canDeactivate: [CanDeactivateBlockNavigationIfChange] }
        ]
      },
      {
        path: 'edit', canActivate: [AuthGuard], children: [
          { path: '', component: VoteCreateComponent },
          { path: ':topicId', component: VoteCreateComponent, canDeactivate: [CanDeactivateBlockNavigationIfChange] }
        ]
      }
    ]
  },
  {
    path: 'ideation', children: [
      {
        path: 'create', canActivate: [AuthGuard], children: [
          { path: '', component: IdeationCreateComponent },
          { path: ':topicId', component: IdeationCreateComponent, canDeactivate: [CanDeactivateBlockNavigationIfChange] }
        ]
      },
      {
        path: 'edit', canActivate: [AuthGuard], children: [
          { path: '', component: IdeationCreateComponent },
          { path: ':topicId', component: IdeationCreateComponent, canDeactivate: [CanDeactivateBlockNavigationIfChange] }
        ]
      }
    ]
  },
  { path: ':topicId/invites/users/:inviteId', component: TopicInvitationDialogComponent },
  {
    path: ':topicId', component: TopicComponent, children: [
      { path: 'invite', component: TopicInviteDialogComponent },
      {
        path: 'ideation', children: [{
          path: ':ideationId', children: [
            {
              path: 'ideas', children: [
                { path: ':ideaId/reports/:reportId/moderate', component: IdeaReportModerateDialogComponent},
                { path: ':ideaId', component: IdeaComponent },
              ]
            }
          ]
        }]
      },
      { path: 'followup', children: [] },
      {
        path: 'votes', children: [
          { path: 'create', canActivate: [AuthGuard], children: [] },
          {
            path: ':voteId', children: [
              { path: 'followup', children: [] },
            ]
          }
        ]
      },
      { path: 'settings', canActivate: [AuthGuard], component: TopicEditComponent },
      { path: 'files', component: TopicAttachmentsDialogComponent },
      { path: 'participants', component: TopicParticipantsDialogComponent },
      { path: 'report', component: TopicReportFormDialogComponent },
      { path: 'reports/:reportId/moderate', component: TopicReportModerateDialogComponent },
      { path: 'reports/:reportId/review', component: TopicReportReviewDialogComponent },
      { path: 'reports/:reportId/resolve', component: TopicReportResolveDialogComponent },
      { path: 'comments/:commentId/reports/:reportId/moderate', component: ArgumentReportModerateDialogComponent },
    ]
  },
  { path: 'join/:token', component: TopicTokenJoinComponent },//https://dev.citizenos.com:3001/topics/join/XwBvIs29gwrH
  { path: '', component: TopicComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule { }
