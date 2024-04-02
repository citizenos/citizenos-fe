import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupTokenJoinComponent, GroupJoinComponent } from './components/group-join/group-join.component';
import { GroupInvitationDialogComponent } from './components/group-invitation/group-invitation.component';
import { GroupComponent } from './group.component';
import { GroupRequestTopicsComponent } from './components/group-request-topics/group-request-topics.component';
import { GroupRequestTopicsHandlerComponent } from './components/group-request-topics-handler/group-request-topics-handler.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {path: 'join/:token', component: GroupTokenJoinComponent},
  {path: ':groupId/invites/users/:inviteId', component: GroupInvitationDialogComponent},
  {
    path: ':groupId/requests/topics/:requestId', canActivate: [AuthGuard], children: [
      {path: '', component: GroupRequestTopicsHandlerComponent},
      {path: 'accept', component: GroupRequestTopicsHandlerComponent},
      {path: 'reject', component: GroupRequestTopicsHandlerComponent},
    ]
  },
  {
    path: '', children: [
      {path: ':groupId/join', component: GroupTokenJoinComponent},
      {
        path: ':groupId', component: GroupComponent, children: []
      },
      {path: '', redirectTo: '/my/groups', pathMatch: 'prefix'},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
