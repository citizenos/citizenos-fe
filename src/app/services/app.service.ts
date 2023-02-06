import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, take } from 'rxjs';
import { Group } from '../interfaces/group';
import { Topic } from '../interfaces/topic';
import { TopicNotificationSettingsComponent } from '../topic/components/topic-notification-settings/topic-notification-settings.component';
import { ConfigService } from './config.service';
import { TopicService } from './topic.service';
import { GroupMemberTopicService } from './group-member-topic.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  showHelp = new BehaviorSubject(false);
  group = new BehaviorSubject<Group | undefined>(undefined);
  topic: Topic | undefined;
  topicsSettings = false;
  wWidth = window.innerWidth;

  constructor(private dialog: MatDialog, public config: ConfigService, private TopicService: TopicService, private GroupMemberTopicService: GroupMemberTopicService, private router: Router) { }


  doShowTopicNotificationSettings(topicId: string) {
    this.dialog.open(TopicNotificationSettingsComponent, { data: { topicId } });
  }

  isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
  };

  createNewTopic(title?: string, visibility?: string, groupId?: string, groupLevel?: string) {
    const topic = <any>{};
    if (title) {
      topic['description'] = '<html><head></head><body><h1>' + title + '</h1></body></html>';
    }
    if (visibility === 'public') {
      topic['visibility'] = this.TopicService.VISIBILITY.public;
    }

    this.TopicService.save(topic)
      .pipe(take(1))
      .subscribe((topic) => {
        if (groupId) {
          const level = groupLevel || this.GroupMemberTopicService.LEVELS.read;
          const member = {
            groupId: groupId,
            topicId: topic.id,
            level: level
          };
          this.GroupMemberTopicService
            .save(member, member)
            .pipe(take(1)).
            subscribe(() => {
              this.router.navigate(['/topic', topic.id], { queryParams: { editMode: true } })
            });
        } else {
          this.router.navigate(['/topic', topic.id], { queryParams: { editMode: true } })
        }
      });
  }
}
