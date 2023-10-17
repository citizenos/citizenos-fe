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
import { BigGraphComponent } from '../topic/components/big-graph/big-graph.component';
import { TopicSettingsComponent, TopicSettingsDialogComponent } from '../topic/components/topic-settings/topic-settings.component';

import { GroupInviteComponent, GroupInviteDialogComponent } from '../group/components/group-invite/group-invite.component';
import { GroupMemberTopicComponent } from '../group/components/group-member-topic/group-member-topic.component';
import { GroupMemberUserComponent } from '../group/components/group-member-user/group-member-user.component';
import { GroupShareComponent } from '../group/components/group-share/group-share.component';
import { GroupAddTopicsComponent, GroupAddTopicsDialogComponent } from '../group/components/group-add-topics/group-add-topics.component';

import { MarkdownDirective } from '../directives/markdown.directive';
import { MarkdownPipe } from '../services/markdown.service';
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
import { PageHeaderComponent } from '../core/components/page-header/page-header.component';
import { ActivitiesButtonComponent } from './components/activities-button/activities-button.component';
import { MobileFiltersDirective, MobileFilterDirective } from '../directives/mobile-filters.directive';
import { CosCalenderComponent } from './cos-calender/cos-calender.component';
import { TourComponent } from './components/tour/tour.component';
import { TourItemDirective, TourItemTemplateComponent } from '../directives/tour-item.directive';

@NgModule({
  declarations: [
    ActivityComponent,
    BigGraphComponent,
    ConfirmDialogComponent,
    CosDropdownDirective,
    CosEllipsisPipe,
    CosInitialsComponent,
    CosPaginationComponent,
    CosToggleComponent,
    EtherpadDirective,
    GroupInviteComponent,
    GroupInviteDialogComponent,
    GroupMemberTopicComponent,
    GroupMemberUserComponent,
    GroupShareComponent,
    GroupAddTopicsComponent,
    GroupAddTopicsDialogComponent,
    GroupInviteUserComponent,
    MarkdownDirective,
    MarkdownPipe,
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
    DragndropDirective,
    PageHeaderComponent,
    ActivitiesButtonComponent,
    MobileFiltersDirective,
    MobileFilterDirective,
    CosCalenderComponent,
    TourComponent,
    TourItemDirective,
    TourItemTemplateComponent
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
    BigGraphComponent,
    ConfirmDialogComponent,
    CosDropdownDirective,
    CosEllipsisPipe,
    CosInitialsComponent,
    CosPaginationComponent,
    CosToggleComponent,
    EtherpadDirective,
    GroupInviteComponent,
    GroupInviteDialogComponent,
    GroupMemberTopicComponent,
    GroupMemberUserComponent,
    GroupShareComponent,
    GroupAddTopicsComponent,
    GroupAddTopicsDialogComponent,
    GroupInviteUserComponent,
    MarkdownDirective,
    MarkdownPipe,
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
    DragndropDirective,
    PageHeaderComponent,
    ActivitiesButtonComponent,
    MobileFiltersDirective,
    MobileFilterDirective,
    CosCalenderComponent,
    TourComponent,
    TourItemDirective,
    TourItemTemplateComponent
   ]
})
export class SharedModule { }
