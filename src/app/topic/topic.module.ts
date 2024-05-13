import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkyModule} from 'ngx-linky';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicComponent } from './topic.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TopicArgumentsComponent } from './components/topic-arguments/topic-arguments.component';
import { ArgumentComponent } from './components/argument/argument.component';
import { TopicNotificationSettingsComponent } from './components/topic-notification-settings/topic-notification-settings.component';
import { PostArgumentComponent } from './components/post-argument/post-argument.component';
import { ArgumentEditComponent } from './components/argument-edits/argument-edits.component';
import { EditArgumentComponent } from './components/edit-argument/edit-argument.component';
import { ArgumentDeletedComponent } from './components/argument-deleted/argument-deleted.component';
import { ArgumentReplyComponent } from './components/argument-reply/argument-reply.component';
import { ArgumentReactionsComponent } from './components/argument-reactions/argument-reactions.component';
import { TopicAttachmentsComponent, TopicAttachmentsDialogComponent } from './components/topic-attachments/topic-attachments.component';
import { TopicMilestonesComponent } from './components/topic-milestones/topic-milestones.component';
import { TopicVoteCreateComponent, TopicVoteCreateDialogComponent } from './components/topic-vote-create/topic-vote-create.component';
import { TopicParticipantsComponent, TopicParticipantsDialogComponent } from './components/topic-participants/topic-participants.component';
import { TopicReportFormComponent, TopicReportFormDialogComponent } from './components/topic-report-form/topic-report-form.component';
import { TopicReportModerateComponent, TopicReportModerateDialogComponent } from './components/topic-report-moderate/topic-report-moderate.component';
import { TopicReportReviewComponent, TopicReportReviewDialogComponent } from './components/topic-report-review/topic-report-review.component';
import { TopicReportResolveComponent, TopicReportResolveDialogComponent } from './components/topic-report-resolve/topic-report-resolve.component';
import { TopicCreateComponent } from './components/topic-create/topic-create.component';
import { TopicVoteSignComponent } from './components/topic-vote-sign/topic-vote-sign.component';
import { TopicVoteSignEsteidComponent } from './components/topic-vote-sign-esteid/topic-vote-sign-esteid.component';
import { TopicVoteSignSmartidComponent } from './components/topic-vote-sign-smartid/topic-vote-sign-smartid.component';
import { ArgumentReportComponent } from './components/argument-report/argument-report.component';
import { ArgumentReportModerateComponent, ArgumentReportModerateDialogComponent } from './components/argument-report-moderate/argument-report-moderate.component';
import { TopicJoinComponent } from './components/topic-join/topic-join.component';
import { TopicInvitationComponent } from './components/topic-invitation/topic-invitation.component';
import { TopicVoteDelegateComponent } from './components/topic-vote-delegate/topic-vote-delegate.component';
import { DuplicateTopicDialogComponent } from './components/duplicate-topic-dialog/duplicate-topic-dialog.component';
import { ArgumentWhyDialogComponent } from './components/argument-why-dialog/argument-why-dialog.component';
import { TopicFollowUpCreateDialogComponent } from './components/topic-follow-up-create-dialog/topic-follow-up-create-dialog.component';
import { VoteCreateComponent } from '../voting/components/vote-create/vote-create.component';
import { InviteEditorsComponent } from './components/invite-editors/invite-editors.component';
import { TopicEditComponent } from './components/topic-edit/topic-edit.component';
import { TopicFormComponent } from './components/topic-form/topic-form.component';
import { TopicReportReasonComponent } from './components/topic-report-reason/topic-report-reason.component';
import { TopicTourDialogComponent } from './components/topic-tour-dialog/topic-tour-dialog.component';
import { TopicVoteReminderDialog } from './components/topic-vote-reminder-dialog/topic-vote-reminder-dialog.component';
import { TopicEditDisabledDialogComponent } from './components/topic-edit-disabled-dialog/topic-edit-disabled-dialog.component';
import { TopicSettingsDisabledDialogComponent } from './components/topic-settings-disabled-dialog/topic-settings-disabled-dialog.component';
import { TopicAddGroupsComponent, TopicAddGroupsDialogComponent } from './components/topic-add-groups/topic-add-groups.component';
import { TopicOnboardingComponent } from './components/topic-onboarding/topic-onboarding.component';
import { DownloadVoteResultsComponent } from './components/download-vote-results/download-vote-results.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IdeationCreateComponent } from '../ideation/components/ideation-create/ideation-create.component';
import { TopicIdeationComponent } from '../ideation/components/topic-ideation/topic-ideation.component';
import { AddIdeaComponent } from '../ideation/components/add-idea/add-idea.component';
import { IdeaboxComponent } from '../ideation/components/ideabox/ideabox.component';
import { IdeaReportComponent } from '../ideation/components/idea-report/idea-report.component';
import { IdeaComponent, IdeaDialogComponent } from '../ideation/components/idea/idea.component';
import { IdeaReplyFormComponent } from '../ideation/components/idea-reply-form/idea-reply-form.component';
import { IdeaReplyComponent } from '../ideation/components/idea-reply/idea-reply.component';
import { IdeaReportModerateComponent, IdeaReportModerateDialogComponent } from '../ideation/components/idea-report-moderate/idea-report-moderate.component';
import { AddIdeaFolderComponent } from '../ideation/components/add-idea-folder/add-idea-folder.component';
import { CreateIdeaFolderComponent } from '../ideation/components/create-idea-folder/create-idea-folder.component';
import { IdeaReportReasonComponent } from '../ideation/components/idea-report-reason/idea-report-reason.component';
import { EditIdeationDeadlineComponent } from '../ideation/components/edit-ideation-deadline/edit-ideation-deadline.component';
import { AddIdeasToFolderComponent } from '../ideation/components/add-ideas-to-folder/add-ideas-to-folder.component';
import { EditIdeaComponent } from '../ideation/components/edit-idea/edit-idea.component';
import { IdeaReplyReportComponent } from '../ideation/components/idea-reply-report/idea-reply-report.component';
import { IdeaReplyReportModerateComponent, IdeaReplyReportModerateDialogComponent } from '../ideation/components/idea-reply-report-moderate/idea-reply-report-moderate.component';
import { EditIdeaFolderComponent } from '../ideation/components/edit-idea-folder/edit-idea-folder.component';

@NgModule({
  declarations: [
    TopicComponent,
    TopicArgumentsComponent,
    ArgumentComponent,
    TopicNotificationSettingsComponent,
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
    TopicVoteCreateDialogComponent,
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
    TopicVoteSignComponent,
    TopicVoteSignEsteidComponent,
    TopicVoteSignSmartidComponent,
    ArgumentReportComponent,
    ArgumentReportModerateComponent,
    ArgumentReportModerateDialogComponent,
    TopicJoinComponent,
    TopicInvitationComponent,
    TopicVoteDelegateComponent,
    DuplicateTopicDialogComponent,
    ArgumentWhyDialogComponent,
    TopicFollowUpCreateDialogComponent,
    VoteCreateComponent,
    InviteEditorsComponent,
    TopicEditComponent,
    TopicFormComponent,
    TopicReportReasonComponent,
    TopicTourDialogComponent,
    TopicVoteReminderDialog,
    TopicEditDisabledDialogComponent,
    TopicSettingsDisabledDialogComponent,
    TopicAddGroupsComponent,
    TopicAddGroupsDialogComponent,
    TopicOnboardingComponent,
    DownloadVoteResultsComponent,
    IdeationCreateComponent,
    TopicIdeationComponent,
    AddIdeaComponent,
    IdeaboxComponent,
    IdeaReportComponent,
    IdeaComponent,
    IdeaDialogComponent,
    IdeaReplyFormComponent,
    IdeaReplyComponent,
    IdeaReportModerateComponent,
    IdeaReportModerateDialogComponent,
    AddIdeaFolderComponent,
    CreateIdeaFolderComponent,
    IdeaReportReasonComponent,
    EditIdeationDeadlineComponent,
    AddIdeasToFolderComponent,
    EditIdeaComponent,
    IdeaReplyReportComponent,
    IdeaReplyReportModerateComponent,
    IdeaReplyReportModerateDialogComponent,
    EditIdeaFolderComponent
  ],
  imports: [
    LinkyModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TopicRoutingModule,
    TranslateModule,
    DragDropModule
  ],
  exports: []
})
export class TopicModule { }
