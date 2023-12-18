import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cos-calender',
  templateUrl: './cos-calender.component.html',
  styleUrls: ['./cos-calender.component.scss']
})

export class CosCalenderComponent implements OnInit {
  @Input() minDate?: Date;
  @Input() date?: Date;
  @Output() dateChange = new EventEmitter();
  yearOptions: number[] = [];
  monthOptions: number[] = [...Array(12).keys()].map(i => i + 1);
  weekdays: number[] = [...Array(7).keys()].map(i => i + 1);
  calendar: number[][] = [];
  year = new Date().getFullYear();
  month = new Date().getMonth();
  day = new Date().getDate();
  selectedDate = new Date();

  ngOnInit(): void {
    if (this.date) {
      console.log(this.date);
      this.selectedDate = new Date(this.date);
      this.day = this.selectedDate.getDay();
      this.month = this.selectedDate.getMonth();
      this.year = this.selectedDate.getFullYear();
    }
    this.generateCalendar(new Date().getFullYear(), new Date().getMonth());
  }

  isSelected(day: number) {
    return (this.month === this.selectedDate.getMonth() && this.year === this.selectedDate.getFullYear() && day === this.selectedDate.getDate());
  }

  selectDate(day: number) {
    if (day < 0 ||
      this.minDate && (this.minDate.getFullYear() > this.year ||
        this.minDate.getFullYear() === this.year && this.minDate.getMonth() > this.month ||
        this.minDate.getFullYear() === this.year && this.minDate.getMonth() === this.month && day < this.minDate.getDate()
      )
    ) { return };
    this.selectedDate.setMonth(this.month);
    this.selectedDate.setFullYear(this.year);
    this.selectedDate.setDate(day);
    this.dateChange.emit(this.selectedDate);
  }

  getDay(day: number) {
    if (day < 0) {
      return day * -1;
    }
    return day;
  }

  generateCalendar(year: number, month: number): void {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const lastDayPrevMonth = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    this.calendar = [];
    let currentDay = 1;
    let nextMonth = false;
    for (let week = 0; week < 6; week++) {
      const weekArray: number[] = [];
      for (let day = 1; day < 8; day++) {
        if (week === 0 && day < firstDay.getDay()) {
          weekArray.push(-(lastDayPrevMonth.getDate() - (firstDay.getDay() - day) + 1));
        } else if (currentDay <= daysInMonth) {
          weekArray.push(currentDay);
          currentDay++;
        } else {
          weekArray.push(-(currentDay - daysInMonth));
          currentDay++;
          nextMonth = true;
        }
      }
      this.calendar.push(weekArray);
    }
  }

  setMonth(value: number) {
    this.month = this.month + value;
    if (this.month === -1) {
      this.month = 11;
      this.year--;
    }
    else if (this.month === 12) {
      this.month = 0;
      this.year++;
    }
    this.updateCalendar();
  }

  updateCalendar(): void {
    this.generateCalendar(this.year, this.month);
  }
}
