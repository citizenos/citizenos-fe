import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkyModule } from 'angular2-linky';

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
import { TopicAttachmentsComponent } from './components/topic-attachments/topic-attachments.component';
import { TopicAttachmentsDialogComponent } from './components/topic-attachments-dialog/topic-attachments-dialog.component';
import { TopicMilestonesComponent } from './components/topic-milestones/topic-milestones.component';
import { TopicVoteCreateComponent } from './components/topic-vote-create/topic-vote-create.component';
import { TopicParticipantsDialogComponent } from './components/topic-participants-dialog/topic-participants-dialog.component';
import { TopicParticipantsComponent } from './components/topic-participants/topic-participants.component';
import { TopicReportFormComponent } from './components/topic-report-form/topic-report-form.component';
import { TopicReportFormDialogComponent } from './components/topic-report-form-dialog/topic-report-form-dialog.component';
import { TopicReportModerateDialogComponent } from './components/topic-report-moderate-dialog/topic-report-moderate-dialog.component';
import { TopicReportModerateComponent } from './components/topic-report-moderate/topic-report-moderate.component';
import { TopicReportReviewComponent } from './components/topic-report-review/topic-report-review.component';
import { TopicReportReviewDialogComponent } from './components/topic-report-review-dialog/topic-report-review-dialog.component';
import { TopicReportResolveDialogComponent } from './components/topic-report-resolve-dialog/topic-report-resolve-dialog.component';
import { TopicReportResolveComponent } from './components/topic-report-resolve/topic-report-resolve.component';


@NgModule({
  declarations: [
    TopicComponent,
    TopicTimelineComponent,
    TopicArgumentsComponent,
    ArgumentComponent,
    TopicNotificationSettingsComponent,
    VoteClosedComponent,
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
  ],
  imports: [
    CommonModule,
    LinkyModule,
    FormsModule,
    SharedModule,
    TopicRoutingModule,
    TranslateModule,
  ]
})
export class TopicModule { }
