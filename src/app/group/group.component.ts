
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { GroupMemberUserService } from 'src/app/services/group-member-user.service';
import { GroupMemberUsersService } from 'src/app/services/group-member-users.service';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../services/auth.service';
import { GroupInviteComponent } from './components/group-invite/group-invite.component';
import { AppService } from '../services/app.service';
import { PublicGroupMemberTopicsService } from '../services/public-group-member-topics.service';
@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  group$;
  groupId: string = '';
  tabSelected = 'topics';
  wWidth: number = window.innerWidth;


  constructor(public dialog: MatDialog,
    public GroupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
    public GroupMemberUser: GroupMemberUserService,
    public GroupMemberUsersService: GroupMemberUsersService,
    private Auth: AuthService, private app: AppService,
    public PublicGroupMemberTopicsService: PublicGroupMemberTopicsService) {
    this.group$ = this.route.params.pipe<Group>(
      switchMap((params) => {
        this.groupId = <string>params['groupId'];
        PublicGroupMemberTopicsService.params$.value.groupId = this.groupId;
        GroupMemberUsersService.params$.value.groupId = this.groupId;
        return this.GroupService.get(params['groupId']).pipe(
          tap((group) => {
            this.app.group.next(group);
          })
        )
      })
    );
  }

  ngOnInit(): void {
  }

  shareGroupDialog() {
    if (this.app.group) {
      const inviteDialog = this.dialog.open(GroupInviteComponent, {data: {group: this.app.group}});
      inviteDialog.afterClosed().subscribe(result => {
        console.log(result);
      });
    }
  }
  leaveGroup() {
    const leaveDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_TXT_ARE_YOU_SURE_CONTINUE',
        points: ['MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_TXT_ARE_YOU_SURE'],
        confirmBtn: 'MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_BTN_NO'
      }
    });

    leaveDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.GroupMemberUser
          .delete({ groupId: this.groupId, userId: this.Auth.user.value.id })
          .subscribe((result) => {
            console.log(result);
          });
      }
    });
  }

  showSettings () {
    this.router.navigate(['settings'], {relativeTo: this.route});
  }

  deleteGroup () {}
}
