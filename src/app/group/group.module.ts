import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { GroupComponent } from './group.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { GroupCreateComponent } from './components/group-create/group-create.component';
import { GroupJoinComponent } from './components/group-join/group-join.component';
import { GroupInvitationComponent } from './components/group-invitation/group-invitation.component';
import { GroupSettingsComponent } from './components/group-settings/group-settings.component';


@NgModule({
  declarations: [
    GroupComponent,
    GroupCreateComponent,
    GroupJoinComponent,
    GroupInvitationComponent,
    GroupSettingsComponent
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
