import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { GroupComponent } from './group.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { GroupInviteComponent } from './components/group-invite/group-invite.component';
import { GroupMemberTopicComponent } from './components/group-member-topic/group-member-topic.component';
import { GroupMemberUserComponent } from './components/group-member-user/group-member-user.component';
import { GroupSettingsComponent, GroupSettingsDialogComponent } from './components/group-settings/group-settings.component';
import { GroupShareComponent } from './components/group-share/group-share.component';


@NgModule({
  declarations: [
    GroupComponent,
    GroupInviteComponent,
    GroupMemberTopicComponent,
    GroupMemberUserComponent,
    GroupSettingsComponent,
    GroupSettingsDialogComponent,
    GroupShareComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    GroupRoutingModule,
    FormsModule
  ]
})
export class GroupModule { }
