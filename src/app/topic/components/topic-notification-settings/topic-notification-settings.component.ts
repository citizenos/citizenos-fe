import { Component, OnInit, Input, Inject } from '@angular/core';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { NotificationService } from '@services/notification.service';
import { TopicNotificationService } from '@services/topic-notification.service';
import { TopicService } from '@services/topic.service';
import { tap, Observable, take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'topic-notification-settings',
  templateUrl: './topic-notification-settings.component.html',
  styleUrls: ['./topic-notification-settings.component.scss']
})
export class TopicNotificationSettingsComponent implements OnInit {
  @Input() topicId!: string;
  private supportedTabs = ['general'];
  public tabSelected = 'general';

  public topic$?: Observable<Topic>;
  public settings: any;
  preferences: any = {
    Topic: false,
    Discussion: false,
    DiscussionComment: false,
    TopicDiscussion: false,
    CommentVote: false,
    TopicComment: false,
    TopicReport: false,
    TopicVoteList: false,
    TopicEvent: false,
    Ideation: false,
    Idea: false,
    IdeaVote: false,
    TopicIdeation: false,
    IdeaComment: false,
    IdeationIdea:false,
    IdeaReport: false,
    CommentReport: false
  };
  allowNotifications = false
  constructor(
    private readonly TopicNotificationService: TopicNotificationService,
    private readonly Notification: NotificationService,
    private readonly Topic: TopicService,
    @Inject(DIALOG_DATA) public data: any,
    private readonly dialog: DialogService) {
    if (data.topicId)
      this.topicId = data.topicId;

    this.topic$ = this.Topic.get(this.data.topicId);
  }

  ngOnInit(): void {
    this.settings = this.TopicNotificationService.get({ topicId: this.topicId }).pipe(
      tap((settings: any) => {
        this.allowNotifications = settings.allowNotifications;
        this.preferences = { ...this.preferences, ...settings.preferences };
        this.settings = { ...this.settings, ...settings };
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

  selectOption(options: string | string[]) {
    if (!Array.isArray(options)) options = [options];
    options.forEach((option) => {
    this.preferences[option] = !this.preferences[option];
      if (this.preferences[option] === true) {
        this.allowNotifications = true;
      }
    });
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
