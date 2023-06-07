import { Topic } from 'src/app/interfaces/topic';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { AppService } from 'src/app/services/app.service';
import { SearchService } from 'src/app/services/search.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { of, tap, switchMap, take, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TopicService } from 'src/app/services/topic.service';
@Component({
  selector: 'group-add-topics',
  templateUrl: './group-add-topics.component.html',
  styleUrls: ['./group-add-topics.component.scss']
})
export class GroupAddTopicsComponent implements OnInit {
  @Input() group!: Group;
  VISIBILITY = this.GroupService.VISIBILITY;
  LEVELS = Object.keys(this.GroupMemberTopicService.LEVELS);
  searchStringTopic?: string;
  searchResults$ = of(<Topic[] | any[]>[]);
  memberTopics$ = of(<Topic[] | any[]>[]);
  resultCount: number = 0;
  searchOrderBy?: string;
  errors?: any;
  constructor(
    private Search: SearchService,
    public GroupService: GroupService,
    private app: AppService,
    public translate: TranslateService,
    public TopicService: TopicService,
    public GroupMemberTopicService: GroupMemberTopicService) {

  }

  ngOnInit(): void {
    if (this.group && this.group.id) {
      this.GroupMemberTopicService.setParam('groupId', this.group.id);
      this.group.members.topics = <Topic[]>[];
      this.memberTopics$ = this.GroupMemberTopicService.loadItems().pipe(
        tap((topics) => {
          this.group.members.topics = topics;
        })
      );
    }
  }

  canUpdate() {
    return this.GroupService.canUpdate(this.group)
  }

  doOrderTopics(property: string) {

  }

  search(str: any): void {
    if (str && str.length >= 2) {
      this.searchStringTopic = str;
      this.searchResults$ = this.Search
        .search(str, {
          include: 'my.topic',
          'my.topic.level': 'admin'
        })
        .pipe(
          switchMap((response) => {
            this.resultCount = response.results.my.topics.count;
            return of(response.results.my.topics.rows);
          }));
    } else {
      this.searchResults$ = of([]);
    }
  }

  addGroupMemberTopic(topic: Topic) {
    this.searchStringTopic = '';
    this.searchResults$ = of([]);

    if (!topic || !topic.id || !topic.title) {
      return false;
    }
    const member = this.group.members.topics?.find((o: Topic) => {
      return o.id === topic.id;
    });

    if (!member) {
      topic.permission.level = this.GroupMemberTopicService.LEVELS.read;
      if (!this.group.members.topics) this.group.members.topics = <Topic[]>[];
      this.group.members.topics.push(topic);
    }
    return
  };

  removeGroupMemberTopic(topic: Topic) {
    this.group.members.topics.splice(this.group.members.topics.indexOf(topic), 1);
  };

  updateGroupMemberTopicLevel(topic: Topic, level: string) {
    topic.permission.level = level;
  };

  doSaveGroup() {
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
          error: (errorResponse) => {
            if (errorResponse && errorResponse.errors) {
              this.errors = errorResponse.errors;
              console.log(errorResponse.errors);
            }
          }
        })
    }
  };
}
