import { Component, Input, Inject, HostBinding } from '@angular/core';
import { DIALOG_DATA, DialogService } from 'src/app/shared/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { TopicService } from 'src/app/services/topic.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-topic-vote-deadline',
  templateUrl: './topic-vote-deadline.component.html',
  styleUrls: ['./topic-vote-deadline.component.scss']
})
export class TopicVoteDeadlineComponent {
  @Input() vote!: any;
  @Input() topic!: Topic;
  deadline = <any>null;
  endsAt = <any>{
    date: null,
    min: 0,
    h: 0,
    timezone: (new Date().getTimezoneOffset() / -60),
    timeFormat: '24'
  };
  HCount = 23;
  numberOfDaysLeft = 0;
  timezones = <any[]>[];
  datePickerMin = new Date();
  reminder = false;
  reminderOptionsList = [{ value: 1, unit: 'days' }, { value: 2, unit: 'days' }, { value: 3, unit: 'days' }, { value: 1, unit: 'weeks' }, { value: 2, unit: 'weeks' }, { value: 1, unit: 'month' }];
  reminderOptions = <any[]>[];
  isNew = true;
  errors = <any>null;

  constructor (
    private Translate: TranslateService,
    @Inject(DIALOG_DATA) data: any,
    private TopicVoteService: TopicVoteService,
    private TopicService: TopicService,
    private dialog: DialogService,
    private Notification: NotificationService
    ) {
    this.setTimeZones();
    if (data && data.vote) {
      this.vote = data.vote;
      if (data.vote.endsAt) {
        const deadline = new Date(data.vote.endsAt);
        this.endsAt.date = data.vote.endsAt;
        this.endsAt.min = deadline.getMinutes();
        this.endsAt.h = deadline.getHours();
        this.setEndsAtTime();
        this.isNew = false;
      }
    }
    if (data && data.topic) {
      this.topic = data.topic;
    }
    if (data.vote.reminderTime) {
      this.reminder = true;
    }
  }
  private setTimeZones() {
    let x = -14;
    while (x <= 12) {
      let separator = '+';
      if (x < 0) separator = '';
      this.timezones.push({
        name: `Etc/GMT${separator}${x}`,
        value: x
      });
      x++;
    }
  };

  toggleDeadline() {
    if (!this.deadline) {
      this.endsAt.h = new Date().getHours();
      this.endsAt.min = Math.ceil(new Date().getMinutes() / 5) * 5;
      this.setEndsAtTime();
    } else {
      this.deadline = null;
    }
  }

  setEndsAtTime() {
    this.endsAt.date = this.endsAt.date || new Date();
    this.deadline = new Date(this.endsAt.date);
    if (this.endsAt.h === 0 && this.endsAt.min === 0) {
      this.deadline = new Date(this.deadline.setDate(this.deadline.getDate() + 1));
    }

    let hour = this.endsAt.h;
    if (this.endsAt.timeFormat === 'PM') { hour += 12; }
    this.deadline.setHours(hour - (this.endsAt.timezone - (this.deadline.getTimezoneOffset() / -60)));
    this.deadline.setMinutes(this.endsAt.min);
   this.daysToVoteEnd();

    this.setReminderOptions();
  };

  setReminderOptions() {
    this.reminderOptions = [];
    this.reminderOptionsList.forEach((item: any) => {
      let timeItem = new Date(this.deadline);
      switch (item.unit) {
        case 'weeks':
          timeItem.setDate(timeItem.getDate() + 1 - (item.value * 7));
          break;
        case 'month':
          timeItem.setMonth(timeItem.getMonth() - item.value);
          break
        default:
          timeItem.setDate(timeItem.getDate() + 1 - item.value);
      }
      if (timeItem > new Date() && (timeItem.getDate() !== (new Date).getDate() || (timeItem.getDate() === (new Date).getDate()) && (timeItem.getFullYear() !== (new Date()).getFullYear() || timeItem.getMonth() !== (new Date()).getMonth())))
        this.reminderOptions.push(item);
    });

  };

  formatTime(val: number | string) {
    if (parseInt(val.toString()) < 10) {
      val = '0' + val;
    }

    return val;
  };

  minHours() {
    if (new Date(this.endsAt.date).getDate() === (new Date()).getDate()) {
      const h = new Date().getHours() + (this.endsAt.timezone - (this.deadline.getTimezoneOffset() / -60));
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

  getTimeZoneName(value: number) {
    return (this.timezones.find((item) => { return item.value === value })).name;
  };

  selectedReminderOption() {
    let voteDeadline = new Date(this.deadline);
    let reminder = new Date(this.vote.reminderTime || '');
    let diffTime = voteDeadline.getTime() - reminder.getTime();
    const days = Math.ceil(diffTime / (1000 * 3600 * 24));
    const weeks = Math.ceil(diffTime / (1000 * 3600 * 24 * 7));
    const months = (voteDeadline.getMonth() - reminder.getMonth() +
      12 * (voteDeadline.getFullYear() - reminder.getFullYear()));

    let item = this.reminderOptions.find((item: any) => {
      if (item.value === days && item.unit === 'days') return item;
      else if (item.value === weeks && item.unit === 'weeks') return item;
      else if (item.value === months && item.unit === 'month') return item;
    });

    if (!item && this.reminderOptions.length) {
      item = this.reminderOptions[0];
      this.setVoteReminder(item);
    }
    if (item)
      return this.Translate.instant('OPTION_' + item.value + '_' + item.unit.toUpperCase());

    return '';
  };

  setVoteReminder(time: any) {
    let reminderTime = new Date(this.deadline);
    switch (time.unit) {
      case 'weeks':
        reminderTime.setDate(reminderTime.getDate() - (time.value * 7));
        break;
      case 'month':
        reminderTime.setMonth(reminderTime.getMonth() - time.value);
        break
      default:
        reminderTime.setDate(reminderTime.getDate() - time.value);
    }
    this.vote.reminderTime = reminderTime;
  };

  daysToVoteEnd() {
    if (this.deadline) {
      this.numberOfDaysLeft = Math.ceil((new Date(this.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    }
    return this.numberOfDaysLeft;
  };

  saveVoteSettings() {
    if (!this.reminder) {
      this.vote.reminderTime = this.vote.reminderTime = null;
    }

    if (this.deadline) {
      this.vote.endsAt = this.deadline
    }
    const saveVote:any = Object.assign(this.vote, {topicId: this.topic.id});
    this.TopicVoteService.update(saveVote)
      .pipe(take(1))
      .subscribe({
        next: (vote) => {
          this.TopicService.reloadTopic();
          this.dialog.closeAll();
        },
        error: (res) => {
          console.debug('createVote() ERR', res, res.errors, this.vote.options);
          this.errors = res.errors;
          Object.values(this.errors).forEach((message) => {
            if (typeof message === 'string')
              this.Notification.addError(message);
          });
        }
      });
  }
}
