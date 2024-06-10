import { Component, Inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { Ideation } from 'src/app/interfaces/ideation';
import { Topic } from 'src/app/interfaces/topic';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicIdeationService } from 'src/app/services/topic-ideation.service';
import { TopicService } from 'src/app/services/topic.service';
import { DIALOG_DATA, DialogService } from 'src/app/shared/dialog';

@Component({
  selector: 'edit-ideation-deadline',
  templateUrl: './edit-ideation-deadline.component.html',
  styleUrls: ['./edit-ideation-deadline.component.scss']
})
export class EditIdeationDeadlineComponent {
  @Input() ideation!: Ideation;
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
  isNew = true;
  errors = <any>null;

  constructor(
    private Translate: TranslateService,
    @Inject(DIALOG_DATA) data: any,
    private TopicIdeationService: TopicIdeationService,
    private TopicService: TopicService,
    private dialog: DialogService,
    private Notification: NotificationService
  ) {
    this.setTimeZones();
    if (data && data.ideation) {
      this.ideation = data.ideation;
      if (data.ideation.deadline) {
        const deadline = new Date(data.ideation.deadline);
        this.endsAt.date = data.ideation.deadline;
        this.endsAt.min = deadline.getMinutes();
        this.endsAt.h = deadline.getHours();
        this.setEndsAtTime();
        this.isNew = false;
      }
    }
    if (data && data.topic) {
      this.topic = data.topic;
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
    this.daysToIdeationEnd();
  };

  formatLength(time: number | string) {
    console.log(time, time.toString().length);
    if (time.toString().length > 2) {
      console.log(parseInt(time.toString().substring(0, 2)))
      time = parseInt(time.toString().substring(0, 2));
    }
  }
  formatTime(val: number | string) {
    console.log('FORMAT')
    if (parseInt(val.toString()) < 10) {
      val = '0' + val;
    }
    if (val.toString().length > 2) {
      val = val.toString().substring(0, 2);
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

  getTimeZoneName(value: number) {
    return (this.timezones.find((item) => { return item.value === value })).name;
  };


  daysToIdeationEnd() {
    if (this.deadline) {
      this.numberOfDaysLeft = Math.ceil((new Date(this.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    }
    return this.numberOfDaysLeft;
  };

  saveIdeationSettings() {
    if (this.deadline) {
      this.ideation.deadline = this.deadline
    }
    const saveIdeation: any = { topicId: this.topic.id, ideationId: this.ideation.id, deadline: this.deadline };
    this.TopicIdeationService.update(saveIdeation)
      .pipe(take(1))
      .subscribe({
        next: (ideation) => {
          this.TopicService.reloadTopic();
          this.dialog.closeAll();
        },
        error: (res) => {
          this.errors = res.errors;
          Object.values(this.errors).forEach((message) => {
            if (typeof message === 'string')
              this.Notification.addError(message);
          });
        }
      });
  }
}
