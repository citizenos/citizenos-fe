import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { GroupJoinService } from 'src/app/services/group-join.service';
import { GroupMemberUserService } from 'src/app/services/group-member-user.service';
import { GroupService } from 'src/app/services/group.service';
import { LocationService } from 'src/app/services/location.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

export interface GroupInviteData {
  group: Group
};

@Component({
  selector: 'app-group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss']
})
export class GroupInviteComponent implements OnInit {
  group: Group;

  public form = {
    inviteMessage: <string | null> null,
    join: {
      level: <string | null> null,
      token: <string | null> null
    },
    joinUrl: <string | null> null
  };

  public inviteMessageMaxLength = 1000;

  public tabs = [
    {
      id: 'users',
      name: 'INVITE_USERS'
    },
    {
      id: 'share',
      name: 'SHARE'
    }
  ];

  public searchResultUsers = [];
  public invalid = [];
  public members = [];
  public tabSelected = 'users';

  constructor(private dialog: MatDialog,
    public dialogRef: MatDialogRef<GroupInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupInviteData,
    public GroupMemberUser: GroupMemberUserService,
    public GroupService: GroupService,
    private Location: LocationService,
    public GroupJoin: GroupJoinService,
    private Auth: AuthService) {
    this.group = data.group;
  }

  ngOnInit(): void {
  }

  generateTokenJoin() {
    const generateTokenDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'MODALS.GROUP_INVITE_SHARE_LINK_GENERATE_CONFIRM_TXT_ARE_YOU_SURE',
        heading: 'MODALS.GROUP_INVITE_SHARE_LINK_GENERATE_CONFIRM_HEADING',
        closeBtn: 'MODALS.GROUP_INVITE_SHARE_LINK_GENERATE_CONFIRM_BTN_NO',
        confirmBtn: 'MODALS.GROUP_INVITE_SHARE_LINK_GENERATE_CONFIRM_BTN_YES',
        points: ['MODALS.GROUP_INVITE_SHARE_LINK_GENERATE_CONFIRM_TXT_POINT1', 'MODALS.GROUP_INVITE_SHARE_LINK_GENERATE_CONFIRM_TXT_POINT2']
      }
    });
    generateTokenDialog.afterClosed().subscribe(result => {
      console.log(result)
      if (result === true) {
        console.log('JOIN', this.group.join.token)
        this.GroupJoin
          .save({
            groupId: this.group.id,
            userId: this.Auth.user.value.id,
            level: this.form.join.level
          }).subscribe(res => {
            this.group.join = res;
            this.form.join.token = res.token;
            this.form.join.level = res.level;
            this.generateJoinUrl();
          })
      }
    });
  };

  doUpdateJoinToken(level: string) {
    const groupJoin = {
      groupId: this.group.id,
      userId: this.Auth.user.value.id,
      level: level,
      token: this.form.join.token
    };

    this.GroupJoin.update(groupJoin).subscribe(res => {
      this.form.join.level = level;
    })
  };

  copyInviteLink() {
    const urlInputElement = document.getElementById('url_invite_group_input') as HTMLInputElement || null;
    urlInputElement.focus();
    urlInputElement.select();
    urlInputElement.setSelectionRange(0, 99999);
    document.execCommand('copy');
  };

  generateJoinUrl() {
    if (this.form.join.token && this.GroupService.canShare(this.group)) {
      this.form.joinUrl = this.Location.getAbsoluteUrl('/groups/join/' + this.form.join.token);
    }
  };

  doSaveGroup () {}
}
