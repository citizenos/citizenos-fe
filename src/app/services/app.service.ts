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
import { LoginComponent } from '../account/components/login/login.component';
declare let hwcrypto: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {
  showNav = false;
  showSearch=false;
  editMode = false;
  showSearchResults = false;
  showSearchFiltersMobile = false;
  showHelp = new BehaviorSubject(false);
  group = new BehaviorSubject<Group | undefined>(undefined);
  topic: Topic | undefined;
  topicsSettings = false;
  wWidth = window.innerWidth;

  constructor(private dialog: MatDialog, public config: ConfigService, private TopicService: TopicService, private GroupMemberTopicService: GroupMemberTopicService, private router: Router) { }

  doShowLogin() {
    this.dialog.closeAll();
    this.dialog.open(LoginComponent);
  }

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
            .save(member)
            .pipe(take(1)).
            subscribe(() => {
              this.router.navigate(['/topics', topic.id], { queryParams: { editMode: true } })
            });
        } else {
          this.router.navigate(['/topics', topic.id], { queryParams: { editMode: true } })
        }
      });
  }

  hwCryptoErrorToTranslationKey(err: any) {
    const errorKeyPrefix = 'MSG_ERROR_HWCRYPTO_';

    switch (err.message) {
      case hwcrypto.NO_CERTIFICATES:
      case hwcrypto.USER_CANCEL:
      case hwcrypto.NO_IMPLEMENTATION:
        return errorKeyPrefix + err.message.toUpperCase();
        break;
      case hwcrypto.INVALID_ARGUMENT:
      case hwcrypto.NOT_ALLOWED:
      case hwcrypto.TECHNICAL_ERROR:
        console.error(err.message, 'Technical error from HWCrypto library', err);
        return errorKeyPrefix + 'TECHNICAL_ERROR';
        break;
      default:
        console.error(err.message, 'Unknown error from HWCrypto library', err);
        return errorKeyPrefix + 'TECHNICAL_ERROR';
    }
  };
}
