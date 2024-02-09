import { DIALOG_DATA } from 'src/app/shared/dialog/dialog-tokens';
import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
//import { DialogRef, DIALOG_DATA } from 'src/app/shared/dialog';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { DialogRef } from 'src/app/shared/dialog/dialog-ref';
import { isEmail } from 'validator';
import { take, of, switchMap, forkJoin, Observable } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { TopicMemberUser } from 'src/app/interfaces/user';
import { NotificationService } from 'src/app/services/notification.service';
import { SearchService } from 'src/app/services/search.service';
import { TopicJoinService } from 'src/app/services/topic-join.service';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { ActivatedRoute } from '@angular/router';
export interface TopicInviteData {
  topic: Topic
};

@Component({
  selector: 'topic-invite',
  templateUrl: './topic-invite.component.html',
  styleUrls: ['./topic-invite.component.scss']
})
export class TopicInviteComponent implements OnInit {
  @Input() dialog?= false;
  @Input() topic!: Topic;
  @Input() members = <any[]>[];
  @Input() inviteMessage?: string;
  @Output() inviteMessageChange = new EventEmitter<string>();
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
  public itemsPerPage = 5;

  public invalid = <any[]>[];
  public LEVELS = Object.keys(this.TopicService.LEVELS);
  public topicLevel = this.LEVELS[0];;

  public tabSelected = 'invite';
  public searchStringUser = '';
  public searchResults$ = of({ users: <any[]>[], groups: <any[]>[], emails: <any[]>[], combined: <any[]>[] });
  private EMAIL_SEPARATOR_REGEXP = /[;,\s]/ig;

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    public TopicMemberUser: TopicMemberUserService,
    public TopicService: TopicService,
    public TopicJoin: TopicJoinService,
    public Search: SearchService,
    private Notification: NotificationService,
    private TopicInviteUser: TopicInviteUserService,
  ) {
    const urlSnap = this.route.snapshot;
    if (urlSnap.queryParams['tab']) {
      this.tabSelected = urlSnap.queryParams['tab'];
    }
  }

  ngOnInit(): void {
  }

  onMessageChange() {
    this.inviteMessageChange.emit(this.inviteMessage);
  }

  search(str: any): void {
    this.searchResultUsers$ = of([]);
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
    }
  }

  addTopicMember(member?: any) {
    if (member?.text) {
      member = member.text
    }
    this.searchResultUsers$ = of([]);
    this.search('');
    if (this.members.length >= this.maxUsers) {
      this.Notification.addError('MSG_ERROR_INVITE_MEMBER_COUNT_OVER_LIMIT');
      return;
    }
    if (!member || (typeof member === 'string' && (isEmail(member) || member.match(this.EMAIL_SEPARATOR_REGEXP)))) {
      return this.addTopicMemberUser();
    }
    if (member.hasOwnProperty('company')) {
      return this.addTopicMemberUser(member);
    }
    if (isEmail(member.email) && member.email === member.userId) {
      return this.addTopicMemberUser();
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

  addTopicMemberUser(member?: any): void {
    this.searchResultUsers$ = of([]);
    this.search('');
    if (member) {
      if (this.members && this.members.find((m: TopicMemberUser) => m.id === member.id)) {
        // Ignore duplicates
      } else {
        const memberClone = Object.assign({}, member);
        memberClone.userId = member.userId;
        memberClone.level = this.topicLevel;
        this.members.push(memberClone);
      }
    } else {
      if (!this.searchStringUser) return;

      // Assume e-mail was entered.
      const emails = this.searchStringUser.replace(this.EMAIL_SEPARATOR_REGEXP, ',').split(',');

      this.searchStringUser = ''
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
          }
        });
      }
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


  doSaveTopic() {
    // Users
    const topicMemberUsersToSave = <Array<Observable<any[]>>>[];
    this.members.forEach((member: TopicMemberUser) => {
      topicMemberUsersToSave.push(this.TopicInviteUser.save(this.topic.id, {
        userId: member.userId || member.id,
        inviteMessage: this.inviteMessage,
        level: member.level
      }))

    });

    if (topicMemberUsersToSave.length) {
      forkJoin(topicMemberUsersToSave)
        .pipe(take(1))
        .subscribe((res: any) => {
          this.Notification.addSuccess('COMPONENTS.TOPIC_INVITE.MSG_INVITES_SENT');
          this.TopicService.reloadTopic();
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


  isOnPage(index: number, page: number) {
    const endIndex = page * this.itemsPerPage;
    return (index >= (endIndex - this.itemsPerPage) && index < endIndex);
  };

  loadPage(pageNr: number) {
    this.membersPage = pageNr;
  };
  /*
    totalPages() {
      return Math.ceil(this.members.length / this.itemsPerPage);
    };*/
  totalPages(items: any) {
    return Math.ceil(items.length / this.itemsPerPage);
  };
}


@Component({
  selector: 'topic-invite-dialog',
  templateUrl: './topic-invite-dialog.component.html',
  styleUrls: ['./topic-invite-dialog.component.scss']
})
export class TopicInviteDialogComponent {
  activeTab = 'invite';
  members = [];
  public inviteMessage = '';
  noUsersSelected = false;
  constructor(private DialogService: DialogService, @Inject(DIALOG_DATA) public data: any, @Inject(DialogRef) private dialog: DialogRef<TopicInviteDialogComponent>, private TopicInviteUser: TopicInviteUserService, public Notification: NotificationService) {
    if (!this.canInvite()) {
      this.activeTab = 'share';
    }
  }

  close () {
    this.dialog.close();
  }
  canInvite() {
    return this.TopicInviteUser.canInvite(this.data.topic);
  }

  doInviteMembers() {
    const topicMemberUsersToInvite = <any[]>[];
    this.members.forEach((member: any) => {
      topicMemberUsersToInvite.push({
        name: member.name,
        imageUrl: member.imageUrl,
        userId: member.userId || member.id,
        level: member.level,
        inviteMessage: this.inviteMessage
      })
    });

    if (topicMemberUsersToInvite.length) {
      if (this.data.topic.id) {
        this.TopicInviteUser.save(this.data.topic.id, topicMemberUsersToInvite)
          .pipe(take(1))
          .subscribe(res => {
            this.Notification.removeAll();
            this.Notification.addSuccess('COMPONENTS.TOPIC_INVITE_DIALOG.MSG_INVITES_SENT');
            this.dialog.close()
          })
      } else {
        this.dialog.close(topicMemberUsersToInvite);
      }
    } else {
      this.Notification.removeAll();
      this.noUsersSelected = true;
      setTimeout(() => this.noUsersSelected = false, 5000)
    }

  }
}

