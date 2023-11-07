import { Component, OnInit, Inject, Input } from '@angular/core';
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

@Component({
  selector: 'app-invite-editors',
  templateUrl: './invite-editors.component.html',
  styleUrls: ['./invite-editors.component.scss']
})
export class InviteEditorsComponent {
  @Input() topic!: Topic;
  members = <any[]>[];

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

  public invalid = <any[]>[];
  public LEVELS = [this.TopicService.LEVELS.edit, this.TopicService.LEVELS.admin];
  public topicLevel = this.LEVELS[0];

  public tabSelected = 'invite';
  public searchStringUser = '';
  public searchResults$ = of({ users: <any[]>[], groups: <any[]>[], emails: <any[]>[], combined: <any[]>[] });
  private EMAIL_SEPARATOR_REGEXP = /[;,\s]/ig;

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    public TopicMemberUser: TopicMemberUserService,
    private TopicMemberGroup: TopicMemberGroupService,
    public TopicService: TopicService,
    public TopicJoin: TopicJoinService,
    public Search: SearchService,
    private Notification: NotificationService,
    private TopicInviteUser: TopicInviteUserService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialogRef<InviteEditorsComponent>
  ) {
    const urlSnap = this.route.snapshot;
    this.topic = data.topic;
    if (urlSnap.queryParams['tab']) {
      this.tabSelected = urlSnap.queryParams['tab'];
    }
  }

  ngOnInit(): void {
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

  addTopicMember(member?: any) {
    if (this.members.length >= this.maxUsers) {
      this.Notification.addError('MSG_ERROR_INVITE_MEMBER_COUNT_OVER_LIMIT');
      return;
    }
    if (member.name === member.email) {
      return this.addTopicMemberUser();
    }
    if (!member || (typeof member === 'string' && (isEmail(member) || member.match(this.EMAIL_SEPARATOR_REGEXP)))) {
      return this.addTopicMemberUser();
    }
    if (member.hasOwnProperty('company')) {
      return this.addTopicMemberUser(member);
    }
  };

  addCorrectedEmail(email: string, key: string) {
    if (isEmail(email.trim())) {
      if (!this.members.find((member: TopicMemberUser) => member.userId === email)) {
        this.members.push({
          userId: email,
          name: email,
          level: this.topicLevel
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
    const users = this.members.filter((member: TopicMemberUser) => {
      return !!member.id;
    }).sort(compare);
    const emails = this.members.filter((member: TopicMemberUser) => {
      return member.userId === member.name;
    }).sort(compare);

    this.members = users.concat(emails);
  };

  addTopicMemberUser(member?: any): void {
    console.log('ADD TOPIC MEMBER', member)
    if (member) {
      if (this.members && this.members.find((m: TopicMemberUser) => m.id === member.id)) {
        // Ignore duplicates
        this.searchStringUser = '';
        this.searchResultUsers$ = of([]);
      } else {
        const memberClone = Object.assign({}, member);
        memberClone.userId = member.userId;
        memberClone.level = this.topicLevel;
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
          if (!this.members.find((member: TopicMemberUser) => member['userId'] === email)) {
            this.members.push({
              userId: email,
              name: email,
              level: this.topicLevel
            });
            this.orderMembers();
          }
        });
      }

      this.searchStringUser = '';
    }
  };

  updateAllMemberLevels(level: string) {
    this.topicLevel = level;
    this.members.forEach((item: TopicMemberUser) => {
      item.level = level;
    });
  };
  removeTopicMemberUser(member: TopicMemberUser) {
    this.members.splice(this.members.indexOf(member), 1);
  };

  updateTopicMemberUserLevel(member: any, level: string) {
    this.members[this.members.indexOf(member)].level = level;
  };

  inviteEditors() {
    // Users
    const topicMemberUsersToSave = <any[]>[];
    //request
    const membersToSave = <any>{};
    this.members.forEach((member: TopicMemberUser) => {
      topicMemberUsersToSave.push({
        userId: member.userId || member.id,
        inviteMessage: this.inviteMessage,
        level: member.level
      })

    });

    if (topicMemberUsersToSave.length) {
      membersToSave['users'] = this.TopicInviteUser.save(this.topic.id, topicMemberUsersToSave)
    }
    if (Object.keys(membersToSave).length) {
      forkJoin(membersToSave)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.TopicService.reloadTopic();
            this.dialog.close(membersToSave);
            this.Notification.addSuccess('Invites sent');
          },
          error: (err) => {
            this.Notification.addError(err.message || err);
          }
        })
    }
  }


  removeAllMembers() {
    this.members = [];
  };


  isOnPage(index: number, page: number) {
    const endIndex = page * this.itemsPerPage;
    return (index >= (endIndex - this.itemsPerPage) && index < endIndex);
  };

  loadPage(pageNr: number) {
    this.membersPage = pageNr;
  };

  totalPages(items: any) {
    return Math.ceil(items.length / this.itemsPerPage);
  };
}
