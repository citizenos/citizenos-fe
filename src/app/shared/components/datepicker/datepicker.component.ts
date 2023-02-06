import { Component, OnInit, Input, Output, ElementRef, EventEmitter, Injectable } from '@angular/core';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  @Input() timezone?: any;
  @Input() autoclose = false;
  @Input() partial: any;
  @Input() model: any;
  @Output() modelChange: any = new EventEmitter<any>();
  datePickerConfig = {
    view: 'month',
    views: ['year', 'month', 'date', 'hours', 'minutes'],
    momentNames: <any>{
      year: 'year',
      month: 'month',
      date: 'day',
      hours: 'hours',
      minutes: 'minutes'
    },
    viewConfig: <any>{
      year: ['years', 'isSameYear'],
      month: ['months', 'isSameMonth'],
      hours: ['hours', 'isSameHour'],
      minutes: ['minutes', 'isSameMinutes'],
    },
    step: 5
  }
  years = <any>null;
  months = <any>null;
  weekdays = <any>this.datePickerUtils.getDaysOfWeek();
  weeks = <any>this.datePickerUtils.getVisibleWeeks(new Date());
  hours = <any>null;
  minutes = <any>null;
  @Input() step = this.datePickerConfig.step;
  element = this.el.nativeElement;
  arrowClick = false;

  eventIsForPicker = this.datePickerUtils.eventIsForPicker;

  minDate = this.getDate('minDate');
  maxDate = this.getDate('maxDate');
  pickerID = this.element.id;
  now = this.createMoment();
  date = this.createMoment();
  selected: any
  views = this.datePickerConfig.views.concat();
  @Input() view = this.datePickerConfig.view;
  @Input() maxView: any;
  @Input() minView: any;
  classes = <any[]>[];
  constructor(private datePickerUtils: DatePickerUtils, private el: ElementRef) {
    this.datePickerUtils.setParams(this.timezone);
    this.selected = this.createMoment(this.model || this.now);
    if (!this.model) {
      //    this.selected.minute(Math.ceil(this.selected.minute() / this.step) * this.step).second(0);
    }

    //   this.callbackOnSetDate = attrs.dateChange ? datePickerUtils.findFunction(scope, attrs.dateChange) : undefined;

    this.prepareViews();
  }

  createMoment(date?: any) {
    console.log(date);
    console.log(new Date());
    if (date) {

      return new Date(date);
    }
    return new Date();
  }

  ngOnInit(): void {
    this.prepareViewData();
    /*if (pickerID) {
      this.$on('pickerUpdate', function (event, pickerIDs, data) {
        if (eventIsForPicker(pickerIDs, pickerID)) {
          var updateViews = false, updateViewData = false;

          if (angular.isDefined(data.minDate)) {
            minDate = data.minDate ? data.minDate : false;
            updateViewData = true;
          }
          if (angular.isDefined(data.maxDate)) {
            maxDate = data.maxDate ? data.maxDate : false;
            updateViewData = true;
          }

          if (angular.isDefined(data.minView)) {
            attrs.minView = data.minView;
            updateViews = true;
          }
          if (angular.isDefined(data.maxView)) {
            attrs.maxView = data.maxView;
            updateViews = true;
          }
          attrs.view = data.view || attrs.view;

          if (updateViews) {
            prepareViews();
          }

          if (updateViewData) {
            update();
          }
        }
      });
    }*/
  }

  prepareViews() {
    this.views = this.views.slice(
      this.views.indexOf(this.maxView || 'year'),
      this.views.indexOf(this.minView || 'minutes') + 1
    );

    if (this.views.length === 1 || this.views.indexOf(this.view) === -1) {
      this.view = this.views[0];
    }
  }

  getDate(name: any) {
    return this.datePickerUtils.getDate(this, this, name);
  }


  setView(nextView: any) {
    if (this.views.indexOf(nextView) !== -1) {
      this.view = nextView;
    }
  };

  selectDate(date: any) {
    if (this.element.attribute.disabled) {
      return false;
    }
    if (this.isSame(this.date, date)) {
      date = this.date;
    }
    date = this.clipDate(date);
    if (!date) {
      return false;
    }
    this.date = date;

    let nextView = this.views[this.views.indexOf(this.view) + 1];
    if ((!nextView || this.partial) || this.model) {
      this.setDate(date);
    }

    if (nextView) {
      this.setView(nextView);
    } else if (this.autoclose) {
      this.element.addClass('hidden');
      // this.$emit('hidePicker');
    } else {
      this.prepareViewData();
    }
    return;
  };

  setDate(date: any) {
    if (date) {
      this.modelChange.emit(date);
      /*  if (ngModel) {
          ngModel.$setViewValue(date);
        }*/
    }
    //    this.$emit('setDate', this.model, this.view);

    //This is duplicated in the new functionality.
    /*  if (this.callbackOnSetDate) {
        this.callbackOnSetDate(attrs.datePicker, this.date);
      }*/
  }

  update() {
    const view = this.view;
    this.datePickerUtils.setParams(this.timezone);

    if (this.model && !this.arrowClick) {
      this.date = this.createMoment(this.model);
      this.arrowClick = false;
    }

    var date = this.date;

    switch (view) {
      case 'year':
        this.years = this.datePickerUtils.getVisibleYears(date);
        break;
      case 'month':
        this.months = this.datePickerUtils.getVisibleMonths(date);
        break;
      case 'date':
        this.weekdays = this.weekdays || this.datePickerUtils.getDaysOfWeek();
        this.weeks = this.datePickerUtils.getVisibleWeeks(date);
        break;
      case 'hours':
        this.hours = this.datePickerUtils.getVisibleHours(date);
        break;
      case 'minutes':
        this.minutes = this.datePickerUtils.getVisibleMinutes(date, this.step);
        break;
    }

    this.prepareViewData();
  }
  /*
    watch() {
      if (this.view !== 'date') {
        return this.view;
      }
      return this.date ? this.date.getUTCMonth() : null;
    }

  this.$watch(watch, update);

  if (this.watchDirectChanges) {
    this.$watch('model', function () {
      arrowClick = false;
      this.update();
    });
  }
  */
  prepareViewData() {
    let view = this.view,
      date = this.date,
      classes = [], classList = '',
      i, j;

    this.datePickerUtils.setParams(this.timezone);

    if (view === 'date') {
      let weeks = this.weeks, week;
      for (i = 0; i < weeks.length; i++) {
        week = weeks[i];
        classes.push(<any>[]);
        for (j = 0; j < week.length; j++) {
          classList = '';
          if (this.datePickerUtils.isSameDay(date, week[j])) {
            classList += 'selected';
          }
          if (this.isNow(week[j], view)) {
            classList += ' now';
          }
          //if (week[j].getUTCMonth() !== date.getUTCMonth()) classList += ' disabled';
          if (week[j].getUTCMonth() !== date.getUTCMonth() || !this.inValidRange(week[j])) {
            classList += ' disabled';
          }
          classes[i].push(classList);
        }
      }
    } else {
      /*    let params = this.datePickerConfig.viewConfig[view],
            dates = this[params[0]],
            compareFunc = params[1];*/
      /*
            for (i = 0; i < dates.length; i++) {
              classList = '';
              if (this.datePickerUtils[compareFunc](date, dates[i])) {
                classList += 'selected';
              }
              if (this.isNow(dates[i], view)) {
                classList += ' now';
              }
              if (!this.inValidRange(dates[i])) {
                classList += ' disabled';
              }
              classes.push(classList);
            }*/
    }
    this.classes = classes;
  }

  next(delta?: any) {
    let date = new Date(this.date);
    delta = delta || 1;
    switch (this.view) {
      case 'year':
      /*falls through*/
      case 'month':
        date.getUTCFullYear();
        break;
      case 'date':
        date.getUTCMonth();
        break;
      case 'hours':
      /*falls through*/
      case 'minutes':
        date.getUTCHours();
        break;
    }
    date = this.clipDate(date);
    if (date) {
      this.date = date;
      this.setDate(date);
      this.arrowClick = true;
      this.update();
    }
  };

  inValidRange(date: any) {
    let valid = true;
    if (this.minDate && this.minDate.isAfter(date)) {
      valid = this.isSame(this.minDate, date);
    }
    if (this.maxDate && this.maxDate.isBefore(date)) {
      valid && this.isSame(this.maxDate, date);
    }
    return valid;
  }

  isSame(date1: any, date2: any) {
    return date1.isSame(date2, this.datePickerConfig.momentNames[this.view]) ? true : false;
  }

  clipDate(date: any) {
    if (this.minDate && this.minDate.isAfter(date)) {
      return this.minDate;
    } else if (this.maxDate && this.maxDate.isBefore(date)) {
      return this.maxDate;
    } else {
      return date;
    }
  }

  isNow(date: any, view: any) {
    let is = true;

    switch (view) {
      case 'minutes':
        is && ~~(this.now.getUTCMinutes() / this.step) === ~~(date.getUTCMinutes() / this.step);
        break;
      /* falls through */
      case 'hours':
        is && this.now.getUTCHours() === date.getUTCHours();
        break;
      /* falls through */
      case 'date':
        is && this.now.getUTCDate() === date.getUTCDate();
        break;
      /* falls through */
      case 'month':
        is && this.now.getUTCMonth() === date.getUTCMonth();
        break;
      /* falls through */
      case 'year':
        is && this.now.getUTCFullYear() === date.getUTCFullYear();
        break;
    }
    return is;
  }

  prev(delta?: any) {
    return this.next(-delta || -1);
  };

}
@Injectable({
  providedIn: 'root'
})
export class DatePickerUtils {
  tz?: any;

  createNewDate(year: any, month: any, day: any, hour: any, minute: any) {
    var utc = Date.UTC(year | 0, month | 0, day | 0, hour | 0, minute | 0);
    //    return this.tz ? moment.tz(utc, this.tz) : moment(utc);
    console.log('UTC', utc);
    return new Date(utc);
  };
  getVisibleMinutes(m: Date, step: any) {
    let year = m.getUTCFullYear(),
      month = m.getUTCMonth(),
      day = m.getUTCDate(),
      hour = m.getUTCHours(), pushedDate,
      offset = (new Date().getTimezoneOffset() / 60) * - 1,
      minutes = <any[]>[];

    for (let minute = 0; minute < 60; minute += step) {
      pushedDate = this.createNewDate(year, month, day, hour - offset, minute);
      minutes.push(pushedDate);
    }
    return minutes;
  }
  getVisibleWeeks(m: any) {
    m = new Date(m);
    var startYear = m.getUTCFullYear(),
      startMonth = m.getUTCMonth();

    //Set date to the first day of the month
    m.setUTCDate(1);

    //Grab day of the week
    var day = m.getUTCDate();

    if (day === 0) {
      //If the first day of the month is a sunday, go back one week.
      m.setUTCDate(-6);
    } else {
      //Otherwise, go back the required number of days to arrive at the previous sunday
      m.setUTCDate(1 - day);
    }

    var weeks = [];

    while (weeks.length < 6) {
      if (m.getUTCFullYear() === startYear && m.getUTCMonth() > startMonth) {
        break;
      }
      weeks.push(this.getDaysOfWeek(m));
      m.setUTCDate(m.getUTCDate()+7);
    }
    return weeks;
  }

  getVisibleYears(d: any) {
    var m = new Date(d),
      year = m.getUTCFullYear();

    m.setUTCFullYear(year - (year % 10));
    year = m.getUTCFullYear();

    var offset = m.getTimezoneOffset() / -60,
      years = [],
      pushedDate,
      actualOffset;

    for (var i = 0; i < 12; i++) {
      pushedDate = this.createNewDate(year, 0, 1, 0 - offset, 0);
      actualOffset = pushedDate.getTimezoneOffset() / -60;
      if (actualOffset !== offset) {
        pushedDate = this.createNewDate(year, 0, 1, 0 - actualOffset, 0);
        offset = actualOffset;
      }
      years.push(pushedDate);
      year++;
    }
    return years;
  }
  getDaysOfWeek(m?:Date) {
   // m = m ? m : (tz ? moment.tz(tz).day(0) : moment().day(0));
    m = m || new Date();
    m.setDate(m.getDate() - m.getDay());
    var year = m.getUTCFullYear(),
      month = m.getUTCMonth(),
      day = m.getUTCDate(),
      days = [],
      pushedDate,
      offset = m.getTimezoneOffset() / -60,
      actualOffset;

    for (var i = 0; i < 7; i++) {
      pushedDate = this.createNewDate(year, month, day, 0 - offset, 0);
      actualOffset = pushedDate.getTimezoneOffset() / -60;
      if (actualOffset !== offset) {
        pushedDate = this.createNewDate(year, month, day, 0 - actualOffset, 0);
      }
      days.push(pushedDate);
      day++;
    }
    return days;
  }

  getVisibleMonths(m: any) {
    var year = m.getUTCFullYear(),
      offset = m.getTimezoneOffset() / -60,
      months = [],
      pushedDate,
      actualOffset;

    for (var month = 0; month < 12; month++) {
      pushedDate = this.createNewDate(year, month, 1, 0 - offset, 0);
      actualOffset = pushedDate.getTimezoneOffset() / -60;
      if (actualOffset !== offset) {
        pushedDate = this.createNewDate(year, month, 1, 0 - actualOffset, 0);
      }
      months.push(pushedDate);
    }
    return months;
  }

  getVisibleHours(m:Date) {
    var year = m.getUTCFullYear(),
      month = m.getUTCMonth(),
      day = m.getUTCDate(),
      hours = [],
      hour, pushedDate, actualOffset,
      offset = m.getTimezoneOffset() / -60;

    for (hour = 0; hour < 24; hour++) {
      pushedDate = this.createNewDate(year, month, day, hour - offset, 0);
      actualOffset = pushedDate.getTimezoneOffset() / -60;
      if (actualOffset !== offset) {
        pushedDate = this.createNewDate(year, month, day, hour - actualOffset, 0);
      }
      hours.push(pushedDate);
    }

    return hours;
  }
  isAfter(model:Date, date:Date) {
    return model && model.getTime() >= date.getTime();
  }
  isBefore(model:Date, date:Date) {
    return model.getTime() <= date.getTime();
  }
  isSameYear(model:Date, date:Date) {
    return model && model.getUTCFullYear() === date.getUTCFullYear();
  }
  isSameMonth(model:Date, date:Date) {
    return this.isSameYear(model, date) && model.getUTCMonth() === date.getUTCMonth();
  }
  isSameDay(model:Date, date:Date) {
    return this.isSameMonth(model, date) && model.getUTCDate() === date.getUTCDate();
  }
  isSameHour(model:Date, date:Date) {
    return this.isSameDay(model, date) && model.getUTCHours() === date.getUTCHours();
  }
  isSameMinutes(model:Date, date:Date) {
    return this.isSameHour(model, date) && model.getUTCMinutes() === date.getUTCMinutes();
  }
  setParams(zone:any) {
    this.tz = zone;
  }
  findFunction(scope:any, name:any) {
    //Search scope ancestors for a matching function.
    //Can probably combine this and the below function
    //into a single search function and two comparison functions
    //Need to add support for lodash style selectors (eg, 'objectA.objectB.function')
   /* var parentScope = scope;
    do {
      parentScope = parentScope.$parent;
      if (angular.isFunction(parentScope[name])) {
        return parentScope[name];
      }
    } while (parentScope.$parent);

    return false;*/
  }
  findParam(scope:any, name:any) {
    //Search scope ancestors for a matching parameter.
   /* var parentScope = scope;
    do {
      parentScope = parentScope.$parent;
      if (parentScope[name]) {
        return parentScope[name];
      }
    } while (parentScope.$parent);

    return false;*/
  }
  createMoment(m:any) {
   /* if (tz) {
      return moment.tz(m, tz);
    } else {
      //If input is a moment, and we have no TZ info, we need to remove TZ
      //info from the moment, otherwise the newly created moment will take
      //the timezone of the input moment. The easiest way to do that is to
      //take the unix timestamp, and use that to create a new moment.
      //The new moment will use the local timezone of the user machine.
      return moment.isMoment(m) ? moment.unix(m.getTime()) : moment(m);
    }*/
    return new Date(m)
  }
  getDate(scope:any, attrs:any, name:any) {
    let result:any = false;
    // Removed the parent scope traversing - it's a bad idea. Probably was because of the ng-if child scope issue?
    if (scope[name]) {
      result = this.createMoment(scope[name]);
    }

    return result;
  }
  eventIsForPicker(targetIDs:string[]|string, pickerID:string) {
    //Checks if an event targeted at a specific picker, via either a string name, or an array of strings.
    return (Array.isArray(targetIDs) && targetIDs.indexOf(pickerID) > -1 || targetIDs === pickerID);
  }
}
