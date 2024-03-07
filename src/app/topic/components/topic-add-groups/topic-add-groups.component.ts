import { Component, OnInit, Inject, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { AppService } from 'src/app/services/app.service';
import { SearchService } from 'src/app/services/search.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { of, tap, switchMap, take, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TopicService } from 'src/app/services/topic.service';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';

@Component({
  selector: 'topic-add-groups',
  templateUrl: './topic-add-groups.component.html',
  styleUrls: ['./topic-add-groups.component.scss']
})
export class TopicAddGroupsComponent {
  @Input() topic!: Topic;
  @Input() dialog = false;
  VISIBILITY = this.TopicService.VISIBILITY;
  LEVELS = Object.keys(this.TopicMemberGroupService.LEVELS);
  searchStringGroup?: string;
  searchResults$ = of(<Group[] | any[]>[]);
  memberGroups$ = of(<Group[] | any[]>[]);
  resultCount: number = 0;
  searchOrderBy?: string;
  errors?: any;
  topicGroups = <Group[]>[];
  membersPage = 1;
  itemsPerPage = 5;

  constructor(
    private Search: SearchService,
    public GroupService: GroupService,
    private app: AppService,
    public translate: TranslateService,
    public TopicService: TopicService,
    public TopicMemberGroupService: TopicMemberGroupService) {

  }

  ngOnInit(): void {
    if (this.topic && this.topic.id) {
      this.TopicMemberGroupService.setParam('groupId', this.topic.id);
      this.topic.members.groups = <Group[]>[];
      this.memberGroups$ = this.TopicMemberGroupService.loadItems().pipe(
        take(1),
        tap((groups) => {
          this.topicGroups = groups;
        })
      );
      this.memberGroups$.subscribe();
    }
  }

  isMember (group: Group) {
    const groupFound = this.topicGroups.find((g) => g.id === group.id );
    if (groupFound) return true;
    return false;
  }

  canUpdate() {
    return this.TopicService.canUpdate(this.topic);
  }

  doOrderTopics(property: string) {

  }

  search(str: any): void {
    if (str && str.length >= 2) {
      this.searchStringGroup = str;
      this.searchResults$ = this.Search
        .search(str, {
          include: 'my.group',
          'my.group.level': 'admin'
        })
        .pipe(
          switchMap((response) => {
            this.resultCount = response.results.my.groups.count;
            return of(response.results.my.groups.rows);
          }));
    } else {
      this.searchResults$ = of([]);
    }
  }

  addTopicMemberGroup(group: Group) {
    this.searchStringGroup = '';
    this.searchResults$ = of([]);
    if (!group || !group.id || !group.name) {
      return false;
    }
    const member = this.topic.members.groups?.find((o: Group) => {
      return o.id === group.id;
    });

    if (!member) {
      if (!group.permission) {
        group.permission = {level: this.TopicMemberGroupService.LEVELS.read}
      } else {
        group.permission.level = this.TopicMemberGroupService.LEVELS.read;
      }
      if (!this.topic.members.groups) this.topic.members.groups = <Group[]>[];
      this.topic.members.groups.push(group);
    }
    return
  };

  removeTopicMemberGroup(group: Group) {
    this.topic.members.groups.splice(this.topic.members.groups.indexOf(group), 1);
  };

  updateTopicMemberGroupLevel(group: Group, level: string) {
    group.permission.level = level;
  };

  doSaveTopic() {
    // Groups
    this.errors = null;
    const groupsToAdd = <any>{};
    this.topic.members.groups.forEach((group: Group) => {
      const member = {
        topicId: this.topic.id,
        groupId: group.id,
        level: group.permission.level
      };

      groupsToAdd[member.topicId] = this.TopicMemberGroupService.save(member);
    });

    if (Object.keys(groupsToAdd).length) {
      forkJoin(groupsToAdd)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.TopicService.reloadTopic();
            this.TopicMemberGroupService.setParam('topicId', this.topic.id);
          },
          error: (errorResponse) => {
            if (errorResponse && errorResponse.errors) {
              this.errors = errorResponse.errors;
              console.error(errorResponse.errors);
            }
          }
        })
    }
  };

  isOnPage(index: any, page: number) {
    const endIndex = page * this.itemsPerPage;
    return (parseInt(index) >= (endIndex - this.itemsPerPage) && parseInt(index) < endIndex);
  };

  loadPage(pageNr: number) {
    this.membersPage = pageNr;
  };

  totalPages(items: any) {
    return Math.ceil(items.length / this.itemsPerPage);
  };

  removeAllGroups() {
    this.topic.members.groups = []
  };

  updateAllLevels(level: string) {
    this.topic.members.groups.forEach((group: any) => {
      group.permission.level = level;
    });
  };
}


@Component({
  templateUrl: './topic-add-groups-dialog.component.html',
  styleUrls: ['./topic-add-groups-dialog.component.scss']
})
export class TopicAddGroupsDialogComponent {
    topic!: Topic;
    noGroupsSelected = false;
  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private dialog: DialogRef<TopicAddGroupsDialogComponent>,
    private TopicService: TopicService,
    private TopicMemberGroup: TopicMemberGroupService
  ) {
    this.topic = this.data.topic;
  }

  doInviteMembers() {
    // Users
    const groupsToAdd = <any>{};
    this.topic.members.groups.forEach((group: Group) => {
      const member = {
        topicId: this.topic.id,
        groupId: group.id,
        level: group.permission.level
      };

      groupsToAdd[member.topicId] = this.TopicMemberGroup.save(member);
    });

    if (Object.keys(groupsToAdd).length) {
      forkJoin(groupsToAdd)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.TopicService.reloadTopic();
            this.TopicMemberGroup.setParam('topicId', this.topic.id);

          this.dialog.close()
          },
          error: (errorResponse) => {
            if (errorResponse && errorResponse.errors) {
              console.error(errorResponse.errors);
            }

      this.dialog.close();
          }
        })
    } else {
      this.noGroupsSelected = true;
      setTimeout(() => {
        this.noGroupsSelected = false;
      }, 5000)
    }
/*
    if (topicsToAdd.length) {
      this.GroupMemberTopic.save(groupMemberTopicsToAdd)
        .pipe(take(1))
        .subscribe(res => {
          this.dialog.close()
        })
    } else {
      this.dialog.close();
    }*/

  }
}
