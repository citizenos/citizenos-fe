import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isEmail } from 'validator';
import { take, of, switchMap, forkJoin, combineLatest, Subscription } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { TopicMemberGroup } from 'src/app/interfaces/group';
import { TopicMemberUser } from 'src/app/interfaces/user';
import { NotificationService } from 'src/app/services/notification.service';
import { SearchService } from 'src/app/services/search.service';
import { TopicJoinService } from 'src/app/services/topic-join.service';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { ActivatedRoute, Router } from '@angular/router';
export interface TopicInviteData {
  topic: Topic
};

@Component({
  selector: 'topic-invite',
  templateUrl: './topic-invite.component.html',
  styleUrls: ['./topic-invite.component.scss']
})
export class TopicInviteComponent implements OnInit {
  topic: Topic;

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

  public searchResultUsers$ = of(<any>[]);
  public resultCount = 0;
  public maxUsers = 550;

  public membersPage = 1;
  public itemsPerPage = 10;
  public memberGroups = ['groups', 'users'];

  public invalid = <any[]>[];
  public members = <any[]>[];
  public groupLevel = 'read';

  public tabSelected = 'invite';
  public searchString = '';
  public searchResults$ = of({ users: <any[]>[], groups: <any[]>[], emails: <any[]>[], combined: <any[]>[] });
  private EMAIL_SEPARATOR_REGEXP = /[;,\s]/ig;
  public topicLevels = Object.keys(this.TopicService.LEVELS);

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<TopicInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TopicInviteData,
    public TopicMemberUser: TopicMemberUserService,
    private TopicMemberGroup: TopicMemberGroupService,
    public TopicService: TopicService,
    public TopicJoin: TopicJoinService,
    public Search: SearchService,
    private Notification: NotificationService,
    private TopicInviteUser: TopicInviteUserService,
  ) {
    this.topic = data.topic;
    const urlSnap = this.route.snapshot;
  }

  ngOnInit(): void {
  }

  /* search(str: any): void {
     if (str && str.length >= 2) {
       this.searchString = str;
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
   }*/
  search(str: any): void {
    if (str && str.length >= 2) {
      this.searchString = str;
      if (str.match(this.EMAIL_SEPARATOR_REGEXP)) {
        this.resultCount = 0;
        this.searchResults$ = of(Object.assign({}, { users: [], groups: [], emails: [], combined: [str] }));
      } else {
        this.searchResults$ = combineLatest([
          this.Search.search(str, { include: ['my.group'] }),
          this.Search.searchUsers(str)
        ]).pipe(
          switchMap(([groupsSearch, usersSearch]) => {
            const results = { users: <any[]>[], groups: <any[]>[], emails: <any[]>[], combined: <any[]>[] };
            if (usersSearch.results.public.users.rows.length) {
              usersSearch.results.public.users.rows.forEach((user: any) => {
                results.users.push(user);
              });
            } else if (isEmail(str)) {
              results.emails.push(this.searchString);
            }
            if (groupsSearch.results.my.groups.rows.length) {
              groupsSearch.results.my.groups.rows.forEach((group: any) => {
                results.groups.push(group);
              });
            }
            results.combined = results.users.concat(results.groups).concat(results.emails);
            this.resultCount = results.combined.length;

            return of(results);
          })
        )


        /*   .then((groupresponse) => {

               .then((userrespons) => {
             this.searchResults$ = angular.merge({}, { users: [], groups: [], emails: [], combined: [] });

             this.searchResults$.combined = this.searchResults$.users.concat(this.searchResults$.groups).concat(this.searchResults$.emails);
           });
           });*/
      }
    } else {
      this.resultCount = 0;
      this.searchResults$ = of(Object.assign({}, { users: [], groups: [], emails: [], combined: [] }));
    }
  };
  addTopicMember(member?: any) {
    if (this.members.length >= this.maxUsers) {
      this.Notification.addError('MSG_ERROR_INVITE_MEMBER_COUNT_OVER_LIMIT');
      return;
    }
    if (!member || (typeof member === 'string' && (isEmail(member) || member.match(this.EMAIL_SEPARATOR_REGEXP)))) {
      return this.addTopicMemberUser();
    }
    if (member.hasOwnProperty('company')) {
      return this.addTopicMemberUser(member);
    } else {
      return this.addTopicMemberGroup(member);
    }
  };

  addTopicMemberGroup(group: any) {
    this.searchString = '';
    //this.searchResults = angular.merge({}, { users: [], groups: [], emails: [], combined: [] });

    if (group && group.id && group.name) {
      const member = this.members.find((m) => m.id === group.id)

      if (!member) {
        const memberClone = Object.assign({}, group);
        memberClone.groupId = group.id;
        memberClone.level = this.groupLevel;

        this.members.push(memberClone);
        this.orderMembers();
      }
    }
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

  removeInvalidEmail(key: string) {
    this.invalid.splice(parseInt(key), 1);
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

  addTopicMemberUser(member?: any): void {
    if (member) {
      if (this.members && this.members.find((m) => m.id === member.id)) {
        // Ignore duplicates
        this.searchString = '';
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
      if (!this.searchString) return;

      // Assume e-mail was entered.
      const emails = this.searchString.replace(this.EMAIL_SEPARATOR_REGEXP, ',').split(',');
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

      this.searchString = '';
    }
  };

  updateGroupLevel(level: string) {
    this.groupLevel = level;
    this.members.forEach((item) => {
      item.level = level;
    });
  };
  doRemoveMemberUser(member: TopicMemberUser) {
    this.members.splice(this.members.indexOf(member), 1);
  };

  updateTopicMemberUserLevel(member: any, level: string) {
    this.members[this.members.indexOf(member)].level = level;
  };

  removeTopicMemberGroup(group: TopicMemberGroup) {
    this.members.splice(this.members.indexOf(group), 1);
  };

  updateTopicMemberGroupLevel(group: TopicMemberGroup, level: string) {
    this.members[this.members.indexOf(group)].level = level;
  };

  doSaveTopic() {
    // Users
    const topicMemberUsersToSave = <any[]>[];
    //request
    const membersToSave = <any>{};
    this.members.forEach((member) => {
      if (member.groupId) {
        member = {
          groupId: member.groupId,
          topicId: this.topic.id,
          level: member.level
        };

        membersToSave[member.groupId] = this.TopicMemberGroup.save(member);
      } else {
        topicMemberUsersToSave.push({
          userId: member.userId || member.id,
          inviteMessage: this.inviteMessage,
          level: member.level
        })
      }
    });

    if (topicMemberUsersToSave.length) {
      membersToSave['users'] = this.TopicInviteUser.save(this.topic.id, topicMemberUsersToSave)
    }
    if (Object.keys(membersToSave).length) {
      forkJoin(membersToSave)
        .pipe(take(1))
        .subscribe((res:any) => {
          this.dialogRef.close();
          this.TopicMemberGroup.reset();
        })
    }
  };

  getExpiresAt() {
    const time = new Date();
    time.setDate(time.getDate() + 14);
    return time;
  }

  removeAllMembers() {
    this.members = [];
  };

  itemsExist(type: any) {
    let exists = false;
    let i = (this.membersPage * this.itemsPerPage) - this.itemsPerPage;
    for (i; i < this.members.length && i < (this.membersPage * this.itemsPerPage); i++) {
      if (type === 'groups') {
        if (this.members[i].groupId) {
          exists = true;
          break;
        }
      } else if (!this.members[i].groupId) {
        exists = true;
        break;
      }

    }

    return exists;
  };


  isOnPage(index: number, page: number) {
    const endIndex = page * this.itemsPerPage;
    return (index >= (endIndex - this.itemsPerPage) && index < endIndex);
  };

  isInGroup(item: any, group: any) {
    if (group === 'groups') {
      return !!item.groupId;
    } else {
      return !item.groupId;
    }
  };

  loadPage(pageNr: number) {
    this.membersPage = pageNr;
  };

  totalPages() {
    return Math.ceil(this.members.length / this.itemsPerPage);
  };
}


@Component({
  selector: 'topic-invite-dialog',
  template: '',
})
export class TopicInviteDialogComponent implements OnInit {
  subscriber: Subscription;

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
      this.subscriber.unsubscribe();
  }
  constructor(private dialog: MatDialog, private TopicService: TopicService, private route: ActivatedRoute, private router: Router) {
    console.log('TopicInviteDialogComponent')
    this.subscriber = this.route.params.pipe(
      switchMap((params) => {
        return this.TopicService.get(params['topicId']);
      }),
    ).subscribe((topic:any) => {
      const inviteDialog = this.dialog.open(TopicInviteComponent, { data: { topic } });
      inviteDialog.afterClosed().subscribe((res)=> {
        this.router.navigate(['..'], {relativeTo: this.route});
      })
    })
  }

  ngOnInit(): void {
  }

}