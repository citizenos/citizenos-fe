import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Group } from '../interfaces/group';
import { Topic } from '../interfaces/topic';
import { TopicNotificationSettingsComponent } from '../topic/components/topic-notification-settings/topic-notification-settings.component';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  showHelp = new BehaviorSubject(false);
  group = new BehaviorSubject<Group | undefined>(undefined);
  topic: Topic | undefined;
  topicsSettings = false;
  wWidth = window.innerWidth;

  constructor(private dialog: MatDialog, public config: ConfigService) { }


  doShowTopicNotificationSettings(topicId: string) {
    this.dialog.open(TopicNotificationSettingsComponent, { data: { topicId } });
  }

  isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
  };
}
