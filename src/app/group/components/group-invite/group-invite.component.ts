import { GroupInviteUserService } from './../../../services/group-invite-user.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isEmail } from 'validator';
import { take, of, switchMap, BehaviorSubject } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupJoinService } from 'src/app/services/group-join.service';
import { GroupMemberUserService } from 'src/app/services/group-member-user.service';
import { GroupService } from 'src/app/services/group.service';
import { SearchService } from 'src/app/services/search.service';
import { NotificationService } from 'src/app/services/notification.service';

export interface GroupInviteData {
  group: BehaviorSubject<Group>
};

@Component({
  selector: 'app-group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss']
})
export class GroupInviteComponent implements OnInit {
  group: Group;

  inviteMessage = <string | null>null;

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

  public searchStringUser = '';
  public searchResultUsers$ = of(<any>[]);
  public resultCount = 0;
  public maxUsers = 550;

  public membersPage = 1;
  public itemsPerPage = 1;
  public memberGroups = ['users', 'emails'];

  public invalid = <any[]>[];
  public members = <any[]>[];
  public groupLevel = 'read';

  public tabSelected = 'users';
  private EMAIL_SEPARATOR_REGEXP = /[;,\s]/ig;

  constructor(private dialog: MatDialog,
    public dialogRef: MatDialogRef<GroupInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupInviteData,
    public GroupMemberUser: GroupMemberUserService,
    public GroupService: GroupService,
    public GroupJoin: GroupJoinService,
    public Search: SearchService,
    private Notification: NotificationService,
    private GroupInviteUser: GroupInviteUserService,
  ) {
    this.group = data.group.value;
  }

  ngOnInit(): void {
  }

  loadPage(pageNr: number) {
    this.membersPage = pageNr;
  };

  totalPages(items:any) {
    return Math.ceil(items.length / this.itemsPerPage);
  };

  doSaveGroup() {
    // Users
    const groupMemberUsersToInvite = <any[]>[];
    this.members.forEach((member) => {
      groupMemberUsersToInvite.push({
        userId: member.userId || member.id,
        level: member.level,
        inviteMessage: this.inviteMessage
      })
    });

    if (groupMemberUsersToInvite.length) {
      this.GroupInviteUser.save({ groupId: this.group.id }, groupMemberUsersToInvite)
        .pipe(take(1))
        .subscribe(res => {
          this.dialogRef.close();
        })
    }

  }

  updateGroupLevel(level: string) {
    this.groupLevel = level;
    this.members.forEach((item) => {
      item.level = level;
    });
  };

  orderMembers() {
    const compare = (a: any, b: any) => {
      const property = 'name';
      return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    };
    const users = this.members.filter((member) => {
      return !!member.id;
    }).sort(compare);
    const emails = this.members.filter((member) => {
      return member.userId === member.name;
    }).sort(compare);

    this.members = users.concat(emails);
  };

  addGroupMemberUser(member?: any): void {
    if (member) {
      if (this.members && this.members.find((m) => m.id === member.id)) {
        // Ignore duplicates
        this.searchStringUser = '';
        this.searchResultUsers$ = of([]);
      } else {
        const memberClone = Object.assign({}, member);
        memberClone.userId = member.userId;
        memberClone.level = this.groupLevel;
        this.members.push(memberClone);
        this.searchResultUsers$ = of([]);

        this.orderMembers();
      }
    } else {
      if (!this.searchStringUser) return;

      // Assume e-mail was entered.
      const emails = this.searchStringUser.replace(this.EMAIL_SEPARATOR_REGEXP, ',').split(',');
      const filtered = emails.filter((email) => {
        if (isEmail(email.trim())) {
          return email.trim();
        } else if (email.trim().length) {
          this.invalid.push(email.trim());
        }

        return;
      });

      if (filtered.length) {
        filtered.sort().forEach((email) => {
          email = email.trim();
          if (this.members.length >= this.maxUsers) {
            return this.Notification.addError('MSG_ERROR_INVITE_MEMBER_COUNT_OVER_LIMIT');
          }
          if (!this.members.find((member) => member['userId'] === email)) {
            this.members.push({
              userId: email,
              name: email,
              level: this.groupLevel
            });
            this.orderMembers();
          }
        });
      }

      this.searchStringUser = '';
    }
  }
  /*add search handle Observable*/
  search(str: any): void {
    if (str && str.length >= 2) {
      this.searchStringUser = str;
      this.searchResultUsers$ = this.Search
        .searchUsers(str)
        .pipe(
          switchMap((response) => {
            this.resultCount = response.results.public.users.count;
            return of(response.results.public.users.rows);
          }));
    } else {
      this.searchResultUsers$ = of([]);
    }
  }

  removeInvalidEmail(key: string) {
    this.invalid.splice(parseInt(key), 1);
  };

  addCorrectedEmail(email: string, key: string) {
    if (isEmail(email.trim())) {
      if (!this.members.find((member) => member.userId === email)) {
        this.members.push({
          userId: email,
          name: email,
          level: this.groupLevel
        });
      }
      this.invalid.splice(parseInt(key), 1);
    }
  };

  removeAllMembers() {
    this.members = []
  };

  itemsExist(type: string) {
    let exists = false;
    let i = (this.membersPage * this.itemsPerPage) - this.itemsPerPage;
    for (i; i < this.members.length && i < (this.membersPage * this.itemsPerPage); i++) {
      if (type === 'users') {
        if (this.members[i].id) {
          exists = true;
          break;
        }
      } else if (this.members[i].userId === this.members[i].name) {
        exists = true;
        break;
      }

    }

    return exists;
  };

  isOnPage(index: any, page: number) {
    const endIndex = page * this.itemsPerPage;
    return (parseInt(index) >= (endIndex - this.itemsPerPage) && parseInt(index) < endIndex);
  };

  isInGroup(item: any, group: string) {
    if (group === 'emails') {
      return item.userId === item.name;
    }
    return item.userId !== item.name;
  };

  doRemoveMemberUser(member: any) {
    this.members.splice(this.members.indexOf(member), 1);
  };

  updateGroupMemberUserLevel(member: any, level: string) {
    this.members[this.members.indexOf(member)].level = level;
  };

  getExpiresAt() {
    const time = new Date();
    time.setDate(time.getDate() + 14);
    return time;
  }
}
