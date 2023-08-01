import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkyModule} from 'ngx-linky';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicComponent } from './topic.component';
import { TopicTimelineComponent } from './components/topic-timeline/topic-timeline.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TopicArgumentsComponent } from './components/topic-arguments/topic-arguments.component';
import { ArgumentComponent } from './components/argument/argument.component';
import { TopicNotificationSettingsComponent } from './components/topic-notification-settings/topic-notification-settings.component';
import { VoteClosedComponent } from './components/vote-closed/vote-closed.component';
import { TopicTabsComponent } from './components/topic-tabs/topic-tabs.component';
import { TopicSidepanelComponent } from './components/topic-sidepanel/topic-sidepanel.component';
import { PostArgumentComponent } from './components/post-argument/post-argument.component';
import { ArgumentEditComponent } from './components/argument-edits/argument-edits.component';
import { EditArgumentComponent } from './components/edit-argument/edit-argument.component';
import { ArgumentDeletedComponent } from './components/argument-deleted/argument-deleted.component';
import { ArgumentReplyComponent } from './components/argument-reply/argument-reply.component';
import { ArgumentReactionsComponent } from './components/argument-reactions/argument-reactions.component';
import { TopicAttachmentsComponent, TopicAttachmentsDialogComponent } from './components/topic-attachments/topic-attachments.component';
import { TopicMilestonesComponent } from './components/topic-milestones/topic-milestones.component';
import { TopicVoteCreateComponent } from './components/topic-vote-create/topic-vote-create.component';
import { TopicParticipantsComponent, TopicParticipantsDialogComponent } from './components/topic-participants/topic-participants.component';
import { TopicReportFormComponent, TopicReportFormDialogComponent } from './components/topic-report-form/topic-report-form.component';
import { TopicReportModerateComponent, TopicReportModerateDialogComponent } from './components/topic-report-moderate/topic-report-moderate.component';
import { TopicReportReviewComponent, TopicReportReviewDialogComponent } from './components/topic-report-review/topic-report-review.component';
import { TopicReportResolveComponent, TopicReportResolveDialogComponent } from './components/topic-report-resolve/topic-report-resolve.component';
import { TopicCreateComponent } from './components/topic-create/topic-create.component';
import { TopicSocialMentionsComponent } from './components/topic-social-mentions/topic-social-mentions.component';
import { TopicVoteSignComponent } from './components/topic-vote-sign/topic-vote-sign.component';
import { TopicVoteSignEsteidComponent } from './components/topic-vote-sign-esteid/topic-vote-sign-esteid.component';
import { TopicVoteSignSmartidComponent } from './components/topic-vote-sign-smartid/topic-vote-sign-smartid.component';
import { ArgumentReportComponent } from './components/argument-report/argument-report.component';
import { ArgumentReportModerateComponent, ArgumentReportModerateDialogComponent } from './components/argument-report-moderate/argument-report-moderate.component';
import { BigGraphComponent } from './components/big-graph/big-graph.component';
import { RegularGraphComponent } from './components/regular-graph/regular-graph.component';
import { TopicJoinComponent } from './components/topic-join/topic-join.component';
import { TopicInvitationComponent } from './components/topic-invitation/topic-invitation.component';
import { TopicReportComponent } from './components/topic-report/topic-report.component';
import { TopicVoteDelegateComponent } from './components/topic-vote-delegate/topic-vote-delegate.component';
import { DuplicateTopicDialogComponent } from './components/duplicate-topic-dialog/duplicate-topic-dialog.component';

@NgModule({
  declarations: [
    TopicComponent,
    TopicTimelineComponent,
    TopicArgumentsComponent,
    ArgumentComponent,
    TopicNotificationSettingsComponent,
    TopicTabsComponent,
    TopicSidepanelComponent,
    PostArgumentComponent,
    ArgumentEditComponent,
    EditArgumentComponent,
    ArgumentDeletedComponent,
    ArgumentReplyComponent,
    ArgumentReactionsComponent,
    TopicAttachmentsComponent,
    TopicAttachmentsDialogComponent,
    TopicMilestonesComponent,
    TopicVoteCreateComponent,
    TopicParticipantsDialogComponent,
    TopicParticipantsComponent,
    TopicReportFormComponent,
    TopicReportFormDialogComponent,
    TopicReportModerateDialogComponent,
    TopicReportModerateComponent,
    TopicReportReviewComponent,
    TopicReportReviewDialogComponent,
    TopicReportResolveDialogComponent,
    TopicReportResolveComponent,
    TopicCreateComponent,
    TopicSocialMentionsComponent,
    TopicVoteSignComponent,
    TopicVoteSignEsteidComponent,
    TopicVoteSignSmartidComponent,
    ArgumentReportComponent,
    ArgumentReportModerateComponent,
    ArgumentReportModerateDialogComponent,
    VoteClosedComponent,
    BigGraphComponent,
    RegularGraphComponent,
    TopicJoinComponent,
    TopicInvitationComponent,
    TopicReportComponent,
    TopicVoteDelegateComponent,
    DuplicateTopicDialogComponent
  ],
  imports: [
    LinkyModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TopicRoutingModule,
    TranslateModule,
  ],
  exports: [
    VoteClosedComponent,
    BigGraphComponent
  ]
})
export class TopicModule { }
