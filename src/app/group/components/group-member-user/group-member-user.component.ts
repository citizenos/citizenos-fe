import { GroupService } from 'src/app/services/group.service';
import { GroupMemberUserService } from 'src/app/services/group-member-user.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Group } from 'src/app/interfaces/group';
import { GroupMemberUser } from 'src/app/interfaces/user';

@Component({
  selector: 'group-member-user',
  templateUrl: './group-member-user.component.html',
  styleUrls: ['./group-member-user.component.scss']
})
export class GroupMemberUserComponent implements OnInit {
  @Input() member?: GroupMemberUser | any;
  @Input() canUpdate?: any;
  @Input() group?: Group;
  @Input() fields?: any;

  constructor(private dialog: MatDialog, public GroupMemberUser: GroupMemberUserService, public GroupService: GroupService) { }

  ngOnInit(): void {
  }

  isVisibleField(field: string) {
    return this.fields?.indexOf(field) > -1
  }

  doUpdateMemberUser(level: string) {
    if (this.member && this.member?.level !== level) {
      const oldLevel = this.member.level;
      this.member.level = level;
      if (this.group) {
        this.GroupMemberUser
          .update({ groupId: this.group.id, userId: this.member.userId || this.member.id }, this.member)
          .pipe(take(1))
          .subscribe((res) => {
            console.log('RES', res)
          })
      }
    }
  };

  doDeleteMemberUser() {
   /* const member = this.member
    if (this.group) {
      const group = this.group
      if (member.id === this.sAuth.user.id) { // IF User tries to delete himself, show "Leave" dialog instead
        return this.doLeaveGroup();
      }
      this.ngDialog
        .openConfirm({
          template: '/views/modals/group_member_user_delete_confirm.html',
          data: {
            user: member
          }
        })
        .then(() => {
          this.GroupMemberUser
            .delete({ groupId: group.id, userId: member.userId })
            .then(() => {
              group.getMemberUsers();
            });
        }, angular.noop);

    } else {
      const topic = this.topic;
      if (member.id = this.sAuth.user.id) {
        return this.doLeaveTopic();
      }
      this.ngDialog
        .openConfirm({
          template: '/views/modals/topic_member_user_delete_confirm.html',
          data: {
            user: member
          }
        })
        .then(() => {
          member.topicId = topic.id;
          this.TopicMemberUser.delete(member)
            .then(() => {
              return this.TopicMemberUserService.reload(); // Good old topic.members.users.splice wont work due to group permission inheritance
            });
        }, angular.noop);
    }*/
  };

}
