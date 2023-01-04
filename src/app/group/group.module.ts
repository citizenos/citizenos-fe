import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { GroupComponent } from './group.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { GroupInviteComponent } from './components/group-invite/group-invite.component';


@NgModule({
  declarations: [
    GroupComponent,
    GroupInviteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    GroupRoutingModule
  ]
})
export class GroupModule { }
