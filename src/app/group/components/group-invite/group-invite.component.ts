import { GroupInviteUserService } from 'src/app/services/group-invite-user.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isEmail } from 'validator';
import { take, of, switchMap, BehaviorSubject } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupJoinService } from 'src/app/services/group-join.service';
import { GroupMemberUserService } from 'src/app/services/group-member-user.service';
import { GroupService } from 'src/app/services/group.service';
import { SearchService } from 'src/app/services/search.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss']
})
export class GroupInviteComponent implements OnInit {
  @Input() group!: Group;

  inviteMessage = <string | null>null;

  inviteMessageMaxLength = 1000;

  tabs = [
    {
      id: 'users',
      name: 'INVITE_USERS'
    },
    {
      id: 'share',
      name: 'SHARE'
    }
  ];

  searchStringUser = '';
  searchResultUsers$ = of(<any>[]);
  resultCount = 0;
  maxUsers = 550;

  membersPage = 1;
  itemsPerPage = 1;
  memberGroups = ['users', 'emails'];

  invalid = <any[]>[];
  LEVELS = this.GroupMemberUser.LEVELS;

  groupLevel = this.LEVELS[0];

  tabSelected = 'users';
  private EMAIL_SEPARATOR_REGEXP = /[;,\s]/ig;

  constructor(private dialog: MatDialog,
    private GroupMemberUser: GroupMemberUserService,
    private GroupService: GroupService,
    private GroupJoin: GroupJoinService,
    private Search: SearchService,
    private Notification: NotificationService,
    private GroupInviteUser: GroupInviteUserService,
  ) { }

  ngOnInit(): void {
    if (this.group.members.users.count || !this.group.members.users) {
      this.group.members.users = [];
    }
  }

  doSaveGroup() {
    // Users
    const groupMemberUsersToInvite = <any[]>[];
    this.group.members.users.forEach((member: any) => {
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
        })
    }

  }

  updateAllLevels(level: string) {
    this.groupLevel = level;
    this.group.members.users.forEach((item: any) => {
      item.level = level;
    });
  };

  loadPage(pageNr: number) {
    this.membersPage = pageNr;
  };

  totalPages(items: any) {
    return Math.ceil(items.length / this.itemsPerPage);
  };

  orderMembers() {
    const compare = (a: any, b: any) => {
      const property = 'name';
      return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    };
    const users = this.group.members.users.filter((member: any) => {
      return !!member.id;
    }).sort(compare);
    const emails = this.group.members.users.filter((member: any) => {
      return member.userId === member.name;
    }).sort(compare);

    this.group.members.users = users.concat(emails);
  };

  addGroupMemberUser(member?: any): void {
    if (member) {
      if (this.group.members.users && this.group.members.users.find((m: any) => m.userId === member.userId)) {
        // Ignore duplicates
        this.searchStringUser = '';
        this.searchResultUsers$ = of([]);
      } else {
        const memberClone = Object.assign({}, member);
        memberClone.userId = member.userId;
        memberClone.level = this.groupLevel;
        this.group.members.users.push(memberClone);
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
          if (this.group.members.users.length >= this.maxUsers) {
            return this.Notification.addError('MSG_ERROR_INVITE_MEMBER_COUNT_OVER_LIMIT');
          }
          if (!this.group.members.users.find((member: any) => member['userId'] === email)) {
            this.group.members.users.push({
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

  search(str: any): void {
    if (str && str.length >= 2) {
      this.searchStringUser = str;
      this.searchResultUsers$ = this.Search
        .searchUsers(str)
        .pipe(
          switchMap((response) => {
            this.resultCount = response.results.public.users.count;
            if (!this.resultCount && isEmail(str)) {
              this.resultCount = 1;
              return of([{ email: str, name: str, userId: str }]);
            }
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
      if (!this.group.members.users.find((member: any) => member.userId === email)) {
        this.group.members.users.push({
          userId: email,
          name: email,
          level: this.groupLevel
        });
      }
      this.invalid.splice(parseInt(key), 1);
    }
  };

  removeAllMembers() {
    this.group.members.users = []
  };

  itemsExist(type: string) {
    let exists = false;
    let i = (this.membersPage * this.itemsPerPage) - this.itemsPerPage;
    for (i; i < this.group.members.users.length && i < (this.membersPage * this.itemsPerPage); i++) {
      if (type === 'users') {
        if (this.group.members.users[i].id) {
          exists = true;
          break;
        }
      } else if (this.group.members.users[i].userId === this.group.members.users[i].name) {
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

  removeGroupMemberUser(member: any) {
    this.group.members.users.splice(this.group.members.users.indexOf(member), 1);
    this.membersPage = 1;
  };

  updateGroupMemberUserLevel(member: any, level: string) {
    this.group.members.users[this.group.members.users.indexOf(member)].level = level;
  };

  getExpiresAt() {
    const time = new Date();
    time.setDate(time.getDate() + 14);
    return time;
  }

  canShare() {
    return this.GroupService.canShare(this.group);
  }

  canUpdate() {
    return this.GroupService.canUpdate(this.group);
  }
}

@Component({
  templateUrl: './group-invite-dialog.component.html',
  styleUrls: ['./group-invite-dialog.component.scss']
})
export class GroupInviteDialogComponent {
  activeTab = 'invite';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private GroupInviteUser: GroupInviteUserService,) {
  }

  doInviteMembers() {
    // Users
    console.log('DO invite', this.data.group.members.users);

    const groupMemberUsersToInvite = <any[]>[];
    this.data.group.members.users.forEach((member: any) => {
      groupMemberUsersToInvite.push({
        userId: member.userId || member.id,
        level: member.level,
        inviteMessage: this.data.group.inviteMessage
      })
    });

    if (groupMemberUsersToInvite.length) {
      this.GroupInviteUser.save({ groupId: this.data.group.id }, groupMemberUsersToInvite)
        .pipe(take(1))
        .subscribe(res => {
          console.log(res)
        })
    }

  }
}
