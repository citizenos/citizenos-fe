import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupSettingsDialogComponent } from './components/group-settings/group-settings.component';
import { GroupJoinComponent } from './components/group-join/group-join.component';
import { GroupInvitationDialogComponent } from './components/group-invitation/group-invitation.component';
import { GroupComponent } from './group.component';

const routes: Routes = [
  {path: 'join/:token', component: GroupJoinComponent},
  {path: ':groupId/invites/users/:inviteId', component: GroupInvitationDialogComponent},
  {
    path: '', children: [
      {
        path: ':groupId', component: GroupComponent, children: [
          { path: 'settings', component: GroupSettingsDialogComponent },
        ]
      },
      {path: '', redirectTo: '/my/groups', pathMatch: 'prefix'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
