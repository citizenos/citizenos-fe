import { Component, OnInit, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from 'src/app/shared/dialog';
import { take } from 'rxjs';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { Topic } from 'src/app/interfaces/topic';

export interface DatepickerModalData {
  date: any,
  topic: Topic
}
@Component({
  selector: 'modal-datepicker',
  templateUrl: './modal-datepicker.component.html',
  styleUrls: ['./modal-datepicker.component.scss']
})
export class ModalDatepickerComponent implements OnInit {
  date!: any;
  topic!: Topic;
  endsAt = {
    date: <any>null,
    min: 0,
    h: 0
  };
  timeFormat = <string | number>24;
  isModalVisible = false;
  deadline: Date = new Date(this.date) || new Date();
  numberOfDaysLeft = 0;
  HCount = <any>23;
  cosModalIsDateSelected = false;
  datePickerMin = new Date();

  constructor(private dialog: DialogRef<ModalDatepickerComponent>, @Inject(DIALOG_DATA) data: DatepickerModalData, private TopicVoteService:TopicVoteService) {
    this.date = data.date || new Date();
    this.topic = data.topic;
    this.setFormValues();
  }

  ngOnInit(): void {
    this.setFormValues();
  }

  formatTime(val: number | string) {
    if (parseInt(val.toString()) < 10) {
      val = '0' + val;
    }
  };

  minHours() {
    if (new Date(this.endsAt.date).getDate() === (new Date()).getDate()) {
      const h = new Date().getHours();
      return h;
    }
    return 1;
  };

  minMinutes() {
    if (new Date(this.endsAt.date).getDate() === (new Date()).getDate()) {
      return Math.ceil(new Date().getUTCMinutes() / 5) * 5;
    }

    return 0
  };

  setFormValues() {
    this.deadline = this.date;
    this.endsAt.date = this.date;
    this.endsAt.min = new Date(this.deadline).getUTCMinutes();
    this.endsAt.h = new Date(this.deadline).getUTCHours();
    this.cosModalIsDateSelected = true;
  };

  setEndsAtTime() {
    this.endsAt.date = this.endsAt.date || new Date();
    this.deadline = new Date(this.endsAt.date);
    if (this.endsAt.h === 0 && this.endsAt.min === 0) {
      this.deadline = new Date(this.deadline.setDate(this.deadline.getDate() + 1));
    }

    let hour = this.endsAt.h;
    if (this.timeFormat === 'PM') { hour += 12; }
    this.deadline.setHours(hour);
    this.deadline.setMinutes(this.endsAt.min);
    this.daysToVoteEnd();
  };

  setTimeFormat() {
    this.HCount = 23;
    if (this.timeFormat !== 24) {
      this.HCount = 11;
      if (this.endsAt.h > 12) {
        this.endsAt.h -= 12;
      }
    }
    this.setEndsAtTime();
  };

  cosModalSaveAction() {
    // The 'add' and 'subtract' - because the picked date is inclusive
    this.date = this.cosModalIsDateSelected ? this.deadline : null;
    const vote: any = { topicId: this.topic.id, voteId: this.topic.voteId };
    if (this.date) {
      vote.endsAt = this.date;
    }

    return this.TopicVoteService
      .update(vote)
      .pipe(take(1))
      .subscribe({
        next: (voteValue) => {
          if (this.topic.vote) {
            this.topic.vote.endsAt = voteValue.endsAt;
          }

          this.dialog.close(voteValue);
        },
        error: (err) => {
          console.error(err);
        }
      });
  };

  daysToVoteEnd() {
    if (this.deadline) {
      this.numberOfDaysLeft = Math.ceil((new Date(this.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    }
    return this.numberOfDaysLeft;
  };
}
