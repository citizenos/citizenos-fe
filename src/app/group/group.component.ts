
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap, of, take, catchError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { GroupMemberUserService } from 'src/app/services/group-member-user.service';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../services/auth.service';
import { GroupInviteComponent } from './components/group-invite/group-invite.component';
import { AppService } from '../services/app.service';
import { PublicGroupMemberTopicsService } from '../services/public-group-member-topics.service';
import { CreateGroupTopicComponent } from './components/create-group-topic/create-group-topic.component';
import { GroupAddTopicsComponent } from './components/group-add-topics/group-add-topics.component';
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
    private GroupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
    public GroupMemberUserService: GroupMemberUserService,
    private Auth: AuthService, private app: AppService,
    public PublicGroupMemberTopicsService: PublicGroupMemberTopicsService) {
    this.group$ = this.route.params.pipe<Group>(
      switchMap((params) => {
        this.groupId = <string>params['groupId'];
        PublicGroupMemberTopicsService.reset()
        PublicGroupMemberTopicsService.setParam('groupId', this.groupId);
        GroupMemberUserService.reset();
        GroupMemberUserService.setParam('groupId', this.groupId);
        return this.GroupService.get(params['groupId']).pipe(
          tap((group) => {
            this.app.group.next(group);
          }),
          catchError((err:any) => {
            console.log(err);
            if (['401', '403', '404'].indexOf(err.status))
              this.router.navigate(['error/' + err.status])
              return of(err);
          })
        )
      })
    );
  }

  ngOnInit(): void {
  }

  shareGroupDialog(group: Group) {
    if (this.app.group) {
      const inviteDialog = this.dialog.open(GroupInviteComponent, { data: { group: group } });
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
        this.GroupMemberUserService
          .delete({ groupId: this.groupId, userId: this.Auth.user.value.id })
          .subscribe((result) => {
            console.log(result);
          });
      }
    });
  }

  showSettings() {
    this.router.navigate(['settings'], { relativeTo: this.route });
  }

  deleteGroup(group: Group) {
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.GROUP_DELETE_CONFIRM_HEADING',
        title: 'MODALS.GROUP_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.GROUP_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.GROUP_DELETE_CONFIRM_TXT_GROUP_DELETED', 'MODALS.GROUP_DELETE_CONFIRM_TXT_LOSE_ACCESS'],
        confirmBtn: 'MODALS.GROUP_DELETE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_DELETE_CONFIRM_BTN_NO'
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.GroupService.delete(group)
          .pipe(take(1))
          .subscribe((res) => {
            console.log(res);
            this.router.navigate(['../'], { relativeTo: this.route });
          })
      }
    });
  }

  createTopicDialog(group: Group) {
    this.dialog.open(CreateGroupTopicComponent, {
      data: {
        group: group
      }
    });
  }

  addTopicDialog(group: Group) {
    this.dialog.open(GroupAddTopicsComponent, {
      data: {
        group: group
      }
    });
  }

  joinGroup(group: Group) {
    const joinDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        heading: 'MODALS.GROUP_JOIN_CONFIRM_HEADING',
        title: 'MODALS.GROUP_JOIN_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.GROUP_JOIN_CONFIRM_TXT_DESC',
        points: ['MODALS.GROUP_JOIN_CONFIRM_TXT_POINT1', 'MODALS.GROUP_JOIN_CONFIRM_TXT_POINT2', 'MODALS.GROUP_JOIN_CONFIRM_TXT_POINT3'],
        confirmBtn: 'MODALS.GROUP_JOIN_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_JOIN_CONFIRM_BTN_NO'
      }
    })/*.openConfirm({
        template: '/views/modals/group_join_confirm.html',
        closeByEscape: false
    })*/
    joinDialog.afterClosed().subscribe((res) => {
      if (res === true) {
        this.GroupService
          .join(group.join.token)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              console.log(res)
              if (res.id) {
                window.location.reload();
              }
            },
            error: (res) => {
              console.error('Failed to join Topic', res)
            }
          });
      }

    });
  }

  canUpdate(group: Group) {
    return this.GroupService.canUpdate(group);
  }
}
