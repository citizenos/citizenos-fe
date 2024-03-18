import { Component, Input } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { GroupInviteUserService } from 'src/app/services/group-invite-user.service';
import { DialogService } from 'src/app/shared/dialog';
import { catchError, take } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'group-invite-user',
  templateUrl: './group-invite-user.component.html',
  styleUrls: ['./group-invite-user.component.scss']
})
export class GroupInviteUserComponent {
  @Input() invite?: any;
  @Input() group: Group | any;
  @Input() fields?: any;

  memberLevels = this.GroupInviteUserService.LEVELS;

  LEVELS = Object.keys(this.GroupInviteUserService.LEVELS);
  constructor(private dialog: DialogService, public app: AppService, private AuthService: AuthService, private GroupInviteUserService: GroupInviteUserService, private GroupService: GroupService) { }

  ngOnInit(): void {
  }

  isVisibleField(field: string) {
    return this.fields?.indexOf(field) > -1
  }

  canUpdate() {
    return this.GroupService.canUpdate(this.group);
  }

  doUpdateInviteUser(level: string) {
    if (this.invite.invite && this.invite?.invite.level !== level) {
      const oldLevel = this.invite.invite.level;
      this.invite.invite.level = level;
      if (this.group) {
        const inviteData = Object.assign({groupId: this.group.id, inviteId: this.invite.invite.id}, this.invite.invite)
        this.GroupInviteUserService
          .update(inviteData)
          .pipe(take(1),
            catchError((error) => {
              this.invite.level = oldLevel
              return error;
            }))
          .subscribe((res) => {
          })
      }
    }
  };

  doDeleteInviteUser() {
    const deleteUserDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        confirmBtn: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_YES',
        closeBtn: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_NO'
      }
    });
    deleteUserDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.invite.groupId = this.group.id;
        this.GroupInviteUserService.delete({ groupId: this.group.id, inviteId: this.invite.id })
          .pipe(take(1))
          .subscribe(() => {
            this.GroupService.reloadGroup();
            this.GroupInviteUserService.reloadItems();
          });
      }
    });
  };
}
