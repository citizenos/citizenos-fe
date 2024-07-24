import { TopicIdeationService } from './../../../services/topic-ideation.service';
import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicService } from 'src/app/services/topic.service';
import { DialogService, DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { take } from 'rxjs';
import { TopicDiscussionService } from 'src/app/services/topic-discussion.service';

@Component({
  selector: 'app-missing-discussion',
  templateUrl: './missing-discussion.component.html',
  styleUrls: ['./missing-discussion.component.scss']
})
export class MissingDiscussionComponent {
  topic!: Topic;
  title: string = '';

  public discussion = {
    question: '',
    deadline: null
  };

  deadline = <any>null;
  numberOfDaysLeft = 0;
  endsAt = <any>{
    date: null,
    min: 0,
    h: 0,
    timeFormat: '24'
  };
  HCount = 23;
  datePickerMin = new Date();
  deadlineSelect = false;

  private dialog = inject(DialogService);
  private data = inject(DIALOG_DATA);

  constructor(public TopicService: TopicService,
    public TopicIdeationService: TopicIdeationService,
    public Translate: TranslateService,
    public Notification: NotificationService,
    @Inject(ActivatedRoute) public route: ActivatedRoute,
    public TopicDiscussionService: TopicDiscussionService,
    @Inject(DialogRef<MissingDiscussionComponent>) private startDiscussionDialog: DialogRef<MissingDiscussionComponent>,
    public router: Router
  ) {
    this.setEndsAtTime();
  }

  ngOnInit(): void {
    this.topic = this.data.topic;
  }

  updateDiscussion() {
    if (this.topic.discussionId) {
      const createDiscussion: any = Object.assign({ topicId: this.topic.id, discussionId: this.topic.discussionId }, this.discussion);
      this.TopicDiscussionService.update(createDiscussion)
        .pipe(take(1))
        .subscribe({
          next: (discussion) => {
            this.TopicService.reloadTopic();
            this.startDiscussionDialog.close(true);
          }
        });
    } else {
      const createDiscussion: any = Object.assign({ topicId: this.topic.id }, this.discussion);
      this.TopicDiscussionService.save(createDiscussion)
        .pipe(take(1))
        .subscribe({
          next: (discussion) => {
            this.TopicService.reloadTopic();
            this.startDiscussionDialog.close(true);
          }
        });
    }
  }


  canEditDiscussion() {
    return this.TopicService.canEdit(this.topic) && (this.topic.status !== this.TopicService.STATUSES.draft || this.topic.status !== this.TopicService.STATUSES.inProgress);
  }

  toggleDeadline() {
    this.deadlineSelect = !this.deadlineSelect;
  }

  minHours() {
    if (new Date(this.endsAt.date).getDate() === (new Date()).getDate()) {
      const h = new Date().getHours();
      return h;
    }
    return 1;
  };

  minMinutes() {
    if (new Date(this.endsAt.date).getDate() === (new Date()).getDate()) {
      return Math.ceil(new Date().getMinutes() / 5) * 5;
    }

    return 0
  };

  setEndsAtTime() {
    this.endsAt.date = this.endsAt.date || new Date();
    this.deadline = new Date(this.endsAt.date);
    if (this.endsAt.h === 0 && this.endsAt.min === 0) {
      this.deadline = new Date(this.deadline.setDate(this.deadline.getDate() + 1));
    }

    let hour = this.endsAt.h;
    if (this.endsAt.timeFormat === 'PM') { hour += 12; }
    this.deadline.setHours(hour);
    this.deadline.setMinutes(this.endsAt.min);
    this.discussion.deadline = this.deadline;
    this.daysToVoteEnd();

    // this.setReminderOptions();
  };


  daysToVoteEnd() {
    if (this.deadline) {
      this.numberOfDaysLeft = Math.ceil((new Date(this.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    }
    return this.numberOfDaysLeft;
  };
  //To display hours in the dropdown like 01
  formatTime(val: number | string) {
    if (parseInt(val.toString()) < 10) {
      val = '0' + val;
    }

    return val;
  };

  timeFormatDisabled() {
    const now = new Date();
    const deadline = new Date(this.deadline);
    if (new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate()).getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
      if (deadline.getHours() > 12) {
        return true;
      }
    }

    return false;
  }

  setTimeFormat() {
    this.HCount = 23;
    if (this.endsAt.timeFormat !== 24) {
      this.HCount = 12;
      if (this.endsAt.h > 12) {
        this.endsAt.h -= 12;
      }
    }
    this.setEndsAtTime();
  };
}
