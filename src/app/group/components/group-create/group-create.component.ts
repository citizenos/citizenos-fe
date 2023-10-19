import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, map, of, take, takeWhile } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { Topic } from 'src/app/interfaces/topic';
import { ConfigService } from 'src/app/services/config.service';
import { GroupService } from 'src/app/services/group.service';
import { SearchService } from 'src/app/services/search.service';
import { TopicService } from 'src/app/services/topic.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { NotificationService } from 'src/app/services/notification.service';
import { GroupInviteUserService } from 'src/app/services/group-invite-user.service';
import { AppService } from 'src/app/services/app.service';
import { countries } from 'src/app/services/country.service';
import { languages } from 'src/app/services/language.service';

@Component({
  selector: 'group-create-component',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements OnInit {
  @ViewChild('imageUpload') fileInput?: ElementRef;

  countries = countries;
  languages = languages;
  group: Group = <Group>{
    name: '',
    description: '',
    imageUrl: '',
    members: {
      users: <any[]>[],
      topics: <Topic[]>[]
    },
    visibility: this.GroupService.VISIBILITY.private,
    contact: null,
    rules: [
      { rule: '' },
      { rule: '' },
      { rule: '' }
    ],
    language: null,
    country: null,
    categories: <string[]>[]
  };

  VISIBILITY = this.GroupService.VISIBILITY;
  CATEGORIES = Object.keys(this.TopicService.CATEGORIES);
  errors?: any;
  tmpImageUrl?: string;
  imageFile?: any;
  tabSelected;
  showHelp = false;
  tabs = ['info', 'settings', 'add_topics', 'invite'];

  searchStringUser = '';
  searchResultUsers$ = of(<any>[]);
  invalid = <any[]>[];
  members = <any[]>[];
  groupLevel = 'read';
  maxUsers = 550;
  private EMAIL_SEPARATOR_REGEXP = /[;,\s]/ig;

  constructor(
    private app: AppService,
    public TopicService: TopicService,
    public translate: TranslateService,
    public GroupService: GroupService,
    private Notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private Search: SearchService,
    private GroupInviteUser: GroupInviteUserService,
    public GroupMemberTopicService: GroupMemberTopicService,
    private config: ConfigService) {
    this.app.darkNav = true;
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('info')
        }
        return fragment
      }
      ));
  }

  selectTab(tab: string) {
    this.router.navigate([], { fragment: tab });
  }

  previousTab(tab: string | void) {
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > 0) {
        this.selectTab(this.tabs[tabIndex - 1]);
      }
    }
  }

  nextTab(tab: string | void) {
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > -1 && tabIndex < 3) {
        this.selectTab(this.tabs[tabIndex + 1]);
      }
    }
  }

  chooseCategory(category: string) {
    if (this.group.categories && this.group.categories.indexOf(category) > -1) {
      this.group.categories.splice(this.group.categories.indexOf(category), 1);
    } else {
      this.group.categories?.push(category);
    }
  }

  removeRule(index: number) {
    this.group.rules?.splice(index, 1);
  }

  addRule() {
    this.group.rules?.push({ rule: '' });
  }

  ngOnInit(): void {
  }

  fileUpload() {
    const files = this.fileInput?.nativeElement.files;
    this.imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      return (e: any) => {
        this.tmpImageUrl = e.target.result;
      };
    })();
    reader.readAsDataURL(files[0]);
  }

  fileDroped(files: any) {
    this.imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      return (e: any) => {
        this.tmpImageUrl = e.target.result;
      };
    })();
    reader.readAsDataURL(files[0]);
  }
  uploadImage() {
    this.fileInput?.nativeElement.click();
  };

  deleteGroupImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }
    this.imageFile = null;
    this.tmpImageUrl = undefined;
  }

  createGroup() {
    this.errors = null;

    this.GroupService.save(this.group).pipe(take(1))
      .subscribe({
        next: (group) => {
          this.group = Object.assign(this.group, group);
          if (this.imageFile) {
            this.GroupService
              .uploadGroupImage(this.imageFile, this.group.id).pipe(
                takeWhile((e) => !e.link, true)
              )
              .subscribe((res: any) => {
                if (res.link) {
                  this.group.imageUrl = res.link;

                  this.dialog.closeAll();
                  this.GroupService.reset();
                  if (group.visibility === this.VISIBILITY.public) {
                    this.router.navigate(['/groups', group.id]);
                  } else {
                    this.router.navigate(['/my', 'groups', group.id]);
                  }
                }
              });
          } else {
            this.GroupService.reset();
            if (group.visibility === this.VISIBILITY.public) {
              this.router.navigate(['/groups', group.id]);
            } else {
              this.router.navigate(['/my', 'groups', group.id]);
            }
          }

          this.doInviteMembers();
          this.doAddTopics();
          this.Notification.addSuccess('VIEWS.GROUP_CREATE.NOTIFICATION_SUCCESS_MESSAGE', 'VIEWS.GROUP_CREATE.NOTIFICATION_SUCCESS_TITLE');
        },
        error: (errorResponse) => {
          if (errorResponse && errorResponse.errors) {
            this.errors = errorResponse.errors;
          }
        }
      });
  }

  doInviteMembers() {
    // Users
    const groupMemberUsersToInvite = <any[]>[];
    this.group.members.users.forEach((member: any) => {
      groupMemberUsersToInvite.push({
        userId: member.userId || member.id,
        level: member.level,
        inviteMessage: this.group.inviteMessage
      })
    });

    if (groupMemberUsersToInvite.length) {
      this.GroupInviteUser.save({ groupId: this.group.id }, groupMemberUsersToInvite)
        .pipe(take(1))
        .subscribe(res => {
        })
    }

  }

  doAddTopics() {
    // Topics
    this.errors = null;
    const topicsToAdd = <any>{};
    this.group.members.topics.forEach((topic: Topic) => {
      const member = {
        groupId: this.group.id,
        topicId: topic.id,
        level: topic.permission.level
      };

      topicsToAdd[member.topicId] = this.GroupMemberTopicService.save(member);
    });

    if (Object.keys(topicsToAdd).length) {
      forkJoin(topicsToAdd)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.GroupService.reloadGroup();
            this.GroupMemberTopicService.setParam('groupId', this.group.id);
          },
          error: (errorResponse: any) => {
            if (errorResponse && errorResponse.errors) {
              this.errors = errorResponse.errors;
            }
          }
        })
    }
  };
}

