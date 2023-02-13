import { Topic } from 'src/app/interfaces/topic';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { AppService } from 'src/app/services/app.service';
import { SearchService } from 'src/app/services/search.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { of, tap, switchMap, take, forkJoin } from 'rxjs';
@Component({
  selector: 'app-group-add-topics',
  templateUrl: './group-add-topics.component.html',
  styleUrls: ['./group-add-topics.component.scss']
})
export class GroupAddTopicsComponent implements OnInit {
  group!: Group;
  VISIBILITY = this.GroupService.VISIBILITY;
  LEVELS = Object.keys(this.GroupMemberTopicService.LEVELS);
  searchStringTopic?: string;
  searchResults$ = of(<Topic[] | any[]>[]);
  memberTopics$ = of(<Topic[] | any[]>[]);
  memberTopics = <Topic[]>[];
  resultCount: number = 0;
  searchOrderBy?: string;
  errors?: any;
  constructor(
    private dialogRef: MatDialogRef<GroupAddTopicsComponent>,
    private Search: SearchService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private GroupService: GroupService,
    private app: AppService,
    private GroupMemberTopicService: GroupMemberTopicService) {
    this.group = data.group;
    GroupMemberTopicService.setParam('groupId', this.group.id);
    this.memberTopics$ = GroupMemberTopicService.loadItems().pipe(
      tap((topics) => {
        this.memberTopics = topics;
      })
    );
  }

  ngOnInit(): void {
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
    const member = this.memberTopics.find((o: any) => {
      return o.id === topic.id;
    });

    if (!member) {
      topic.permission.level = this.GroupMemberTopicService.LEVELS.read;
      this.memberTopics.push(topic);
    }
    return
  };

  removeGroupMemberTopic(topic: Topic) {
    this.memberTopics.splice(this.memberTopics.indexOf(topic), 1);
  };

  updateGroupMemberTopicLevel(topic: Topic, level: string) {
    topic.permission.level = level;
  };

  doSaveGroup() {
    // Topics
    this.errors = null;
    const topicsToAdd = <any>{};
    this.memberTopics.forEach((topic) => {
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
            this.dialogRef.close();
            this.GroupMemberTopicService.reset();
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
