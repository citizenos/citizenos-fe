import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-datepicker',
  templateUrl: './modal-datepicker.component.html',
  styleUrls: ['./modal-datepicker.component.scss']
})
export class ModalDatepickerComponent implements OnInit {
  @Input() cosModalTitle?: string;
  @Input() cosModalDescription?: string;
  @Input() cosModalLinkText?: string;
  @Input() date!: any;
  @Output() cosModalOnSave = new EventEmitter<any | null>();
  endsAt = {
    date: <any>null,
    min: 0,
    h: 0
  };
  timezones = <any[]>[
    { name: "Etc/GMT+0", value: 0 },
    { name: "Etc/GMT+1", value: 1 },
    { name: "Etc/GMT+2", value: 2 },
    { name: "Etc/GMT+3", value: 3 },
    { name: "Etc/GMT+4", value: 4 },
    { name: "Etc/GMT+5", value: 5 },
    { name: "Etc/GMT+6", value: 6 },
    { name: "Etc/GMT+7", value: 7 },
    { name: "Etc/GMT+8", value: 8 },
    { name: "Etc/GMT+9", value: 9 },
    { name: "Etc/GMT+10", value: 10 },
    { name: "Etc/GMT+11", value: 11 },
    { name: "Etc/GMT+12", value: 12 },
    { name: "Etc/GMT-0", value: -0 },
    { name: "Etc/GMT-1", value: -1 },
    { name: "Etc/GMT-2", value: -2 },
    { name: "Etc/GMT-3", value: -3 },
    { name: "Etc/GMT-4", value: -4 },
    { name: "Etc/GMT-5", value: -5 },
    { name: "Etc/GMT-6", value: -6 },
    { name: "Etc/GMT-7", value: -7 },
    { name: "Etc/GMT-8", value: -8 },
    { name: "Etc/GMT-9", value: -9 },
    { name: "Etc/GMT-10", value: -10 },
    { name: "Etc/GMT-11", value: -11 },
    { name: "Etc/GMT-12", value: -12 },
    { name: "Etc/GMT-13", value: -13 },
    { name: "Etc/GMT-14", value: -14 }
  ];
  timezone = (new Date().getTimezoneOffset() / -60);
  timeFormat = <string | number>24;
  isModalVisible = false;
  deadline: Date = new Date(this.date) || new Date();
  numberOfDaysLeft = 0;
  HCount = <any>24;
  cosModalIsDateSelected = false;
  datePickerMin = new Date();
  /*
        private date;
        private model;
        private cosModalOnSave; // Expects a function that returns a Promise
        private timezones;
        private HCount;*/
  /*date: '=?',
  cosModalOnSave: '&', // Expects a function that returns a Promise*/
  constructor() { }

  ngOnInit(): void {
    this.setFormValues();
  }

  getTimeZoneName(value: number) {
    return (this.timezones.find((item) => { return item.value === value })).name;
  };

  cosModalOpen(date?: any) {
    this.isModalVisible = true;
    if (date) {
      this.setFormValues();
    }
  };

  cosModalClose() {
    this.isModalVisible = false;
  };

  formatTime(val: number | string) {
    if (val < 10) {
      val = '0' + val;
    }
  };

  minHours() {
    if (new Date(this.endsAt.date).getDate() === (new Date()).getDate()) {
      return new Date().getUTCHours();
    }
    return 0;
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
    this.timezone = (new Date(this.deadline).getTimezoneOffset() / 60) * -1;
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
    this.deadline.setUTCHours(hour - this.timezone);
    this.deadline.setUTCMinutes(this.endsAt.min);
    this.daysToVoteEnd();
  };

  setTimeFormat() {
    this.HCount = 24;
    if (this.timeFormat !== 24) {
      this.HCount = 12;
      if (this.endsAt.h > 12) {
        this.endsAt.h -= 12;
      }
    }
    this.setEndsAtTime();
  };

  cosModalSaveAction() {
    // The 'add' and 'subtract' - because the picked date is inclusive
    this.date = this.cosModalIsDateSelected ? this.deadline : null;
    this.cosModalClose();
    this.cosModalOnSave.emit(this.date)
    this.cosModalClose();
  };

  daysToVoteEnd() {
    if (this.deadline) {
      this.numberOfDaysLeft = Math.ceil((new Date(this.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    }
    return this.numberOfDaysLeft;
  };
}
