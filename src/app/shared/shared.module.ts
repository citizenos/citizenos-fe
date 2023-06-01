import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkyModule} from 'ngx-linky';

import { TopicboxComponent } from '../public-topics/components/topicbox/topicbox.component';
import { PublicgroupboxComponent } from '../public-groups/components/publicgroupbox/publicgroupbox.component';
import { GroupboxComponent } from '../my-groups/components/groupbox/groupbox.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from '../directives/tooltip';
import { CosDropdownDirective } from '../directives/cos-dropdown.directive';

import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { TypeaheadComponent, TypeaheadItem, TypeaheadSelect } from './components/typeahead/typeahead.component';
import { FormsModule } from '@angular/forms';
import { CosInitialsComponent } from './components/cos-initials/cos-initials.component';
import { MomentModule } from 'ngx-moment';
import { QRCodeModule } from 'angularx-qrcode';
import { CosPaginationComponent } from './components/cos-pagination/cos-pagination.component';
import { SocialshareDirective } from '../directives/socialshare.directive';
import { ActivityComponent } from './components/activity/activity.component';
import { CosToggleComponent } from './components/cos-toggle/cos-toggle.component';
import { TopicMemberUserComponent } from '../topic/components/topic-member-user/topic-member-user.component';
import { TopicMemberGroupComponent } from '../topic/components/topic-member-group/topic-member-group.component';
import { TopicMemberInviteComponent } from '../topic/components/topic-member-invite/topic-member-invite.component';
import { TopicMemberInviteDeleteComponent } from '../topic/components/topic-member-invite-delete/topic-member-invite-delete.component';
import { TopicVoteCastComponent } from '../topic/components/topic-vote-cast/topic-vote-cast.component';
import { TopicSettingsComponent, TopicSettingsDialogComponent } from '../topic/components/topic-settings/topic-settings.component';

import { GroupInviteComponent } from '../group/components/group-invite/group-invite.component';
import { GroupMemberTopicComponent } from '../group/components/group-member-topic/group-member-topic.component';
import { GroupMemberUserComponent } from '../group/components/group-member-user/group-member-user.component';
import { GroupSettingsComponent, GroupSettingsDialogComponent } from '../group/components/group-settings/group-settings.component';
import { GroupShareComponent } from '../group/components/group-share/group-share.component';
import { CreateGroupTopicComponent } from '../group/components/create-group-topic/create-group-topic.component';
import { GroupAddTopicsComponent } from '../group/components/group-add-topics/group-add-topics.component';

import { MarkdownDirective } from '../directives/markdown.directive';
import { CosEllipsisPipe } from './pipes/cos-ellipsis.pipe';
import { ModalDatepickerComponent } from './components/modal-datepicker/modal-datepicker.component';
import { MatNativeDateModule } from '@angular/material/core';
import { GroupInviteUserComponent } from '../group/components/group-invite-user/group-invite-user.component';
import { CheckHeightDirective } from '../directives/check-height.directive';
import { EtherpadDirective } from '../directives/etherpad.directive';
import { CosInputComponent } from './components/cos-input/cos-input.component';
import { HtmlDirective } from '../directives/html.directive';
import { DownloadDirective } from '../directives/download.directive';
import { CosDisabledDirective } from '../directives/cos-disabled.directive';
import { DragndropDirective } from '../directives/dragndrop.directive';

@NgModule({
  declarations: [
    ActivityComponent,
    ConfirmDialogComponent,
    CosDropdownDirective,
    CosEllipsisPipe,
    CosInitialsComponent,
    CosPaginationComponent,
    CosToggleComponent,
    EtherpadDirective,
    GroupInviteComponent,
    GroupMemberTopicComponent,
    GroupMemberUserComponent,
    GroupSettingsComponent,
    GroupSettingsDialogComponent,
    GroupShareComponent,
    CreateGroupTopicComponent,
    GroupAddTopicsComponent,
    GroupInviteUserComponent,
    MarkdownDirective,
    PublicgroupboxComponent,
    SocialshareDirective,
    TooltipDirective,
    TopicMemberInviteComponent,
    TopicMemberInviteDeleteComponent,
    TopicMemberUserComponent,
    TopicMemberGroupComponent,
    TopicSettingsComponent,
    TopicSettingsDialogComponent,
    TopicVoteCastComponent,
    TopicboxComponent,
    TypeaheadComponent,
    TypeaheadItem,
    TypeaheadSelect,
    ModalDatepickerComponent,
    CheckHeightDirective,
    CosInputComponent,
    HtmlDirective,
    DownloadDirective,
    GroupboxComponent,
    CosDisabledDirective,
    DragndropDirective
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentModule,
    QRCodeModule,
    TranslateModule,
    LinkyModule
  ],
   exports: [
    ActivityComponent,
    ConfirmDialogComponent,
    CosDropdownDirective,
    CosEllipsisPipe,
    CosInitialsComponent,
    CosPaginationComponent,
    CosToggleComponent,
    EtherpadDirective,
    GroupInviteComponent,
    GroupMemberTopicComponent,
    GroupMemberUserComponent,
    GroupSettingsComponent,
    GroupSettingsDialogComponent,
    GroupShareComponent,
    CreateGroupTopicComponent,
    GroupAddTopicsComponent,
    GroupInviteUserComponent,
    MarkdownDirective,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentModule,
    PublicgroupboxComponent,
    QRCodeModule,
    SocialshareDirective,
    TooltipDirective,
    TopicboxComponent,
    TopicMemberInviteComponent,
    TopicMemberInviteDeleteComponent,
    TopicMemberUserComponent,
    TopicMemberGroupComponent,
    TopicSettingsComponent,
    TopicSettingsDialogComponent,
    TopicVoteCastComponent,
    TypeaheadComponent,
    TypeaheadItem,
    TypeaheadSelect,
    CheckHeightDirective,
    CosInputComponent,
    HtmlDirective,
    DownloadDirective,
    GroupboxComponent,
    CosDisabledDirective,
    DragndropDirective
   ]
})
export class SharedModule { }
