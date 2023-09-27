import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicNotificationService } from 'src/app/services/topic-notification.service';
import { TopicService } from 'src/app/services/topic.service';
import { tap, map, Observable, take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'topic-notification-settings',
  templateUrl: './topic-notification-settings.component.html',
  styleUrls: ['./topic-notification-settings.component.scss']
})
export class TopicNotificationSettingsComponent implements OnInit {
  @Input() topicId?: string;
  private supportedTabs = ['general'];
  public tabSelected = 'general';

  public topic?: Observable<Topic>;
  public settings: any;
  preferences: any = {
    Topic: false,
    TopicComment: false,
    CommentVote: false,
    TopicReport: false,
    TopicVoteList: false,
    TopicEvent: false
  };
  allowNotifications = false
  constructor(
    private TopicNotificationService: TopicNotificationService,
    private Notification: NotificationService,
    private Topic: TopicService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {
    if (data.topicId)
      this.topicId = data.topicId;
  }

  ngOnInit(): void {
    this.topic = this.Topic.get(this.data.topicId);
    this.settings = this.TopicNotificationService.get({ topicId: this.topicId }).pipe(
      tap((settings: any) => {
        this.allowNotifications = settings.allowNotifications;
        this.preferences = Object.assign(this.preferences, settings.preferences);
        this.settings = Object.assign(this.settings, settings);
      })
    )
  }

  toggleAllNotifications() {
    let toggle = true;
    this.allowNotifications = false;
    if (Object.values(this.preferences).indexOf(false) === -1) {
      toggle = false;
    }
    Object.keys(this.preferences).forEach((key) => {
      if (toggle) {
        return this.preferences[key] = true;
      }

      return this.preferences[key] = false;
    });
    if (toggle) {
      this.allowNotifications = true;
    }
  };

  allChecked() {
    return (Object.values(this.preferences).indexOf(false) === -1)
  };

  selectOption(option: string) {
    this.preferences[option] = !this.preferences[option];
    if (this.preferences[option] === true) {
      this.allowNotifications = true;
    }
  };

  doSaveSettings() {
    if (!this.allowNotifications) {
      this.TopicNotificationService.delete({ topicId: this.topicId }).pipe(
        take(1)
      ).subscribe();
    } else {
      this.TopicNotificationService.update({ allowNotifications: this.allowNotifications, preferences: this.preferences, topicId: this.topicId }).pipe(
        take(1)
      ).subscribe();
    }
    this.dialog.closeAll();
  };

}
