import { Component, OnInit, Output, EventEmitter, Input, Inject, inject, HostBinding, ChangeDetectorRef, enableProdMode } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { Vote } from 'src/app/interfaces/vote';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'topic-vote-create',
  templateUrl: './topic-vote-create.component.html',
  styleUrls: ['./topic-vote-create.component.scss']
})
export class TopicVoteCreateComponent implements OnInit {
  @Input() topic!: Topic;
  @Input() vote!: any;
  @Output() saveVote = new EventEmitter();

  VOTE_TYPES = this.TopicVoteService.VOTE_TYPES;
  voteTypes = Object.keys(this.VOTE_TYPES);
  VOTE_AUTH_TYPES = this.TopicVoteService.VOTE_AUTH_TYPES;
  HCount = 23;
  timezones = <any[]>[];
  datePickerMin = new Date();
  public CONF = {
    autoClose: [{
      value: 'allMembersVoted',
      enabled: false
    }],
    optionsMax: 10,
    optionsMin: 2
  };

  topicId = '';

  public voteDefault = {
    description: <string>'',
    topicId: <string>'',
    options: <any>[],
    delegationIsAllowed: false,
    type: '',
    authType: '',
    maxChoices: <number>1,
    minChoices: <number>1,
    reminderTime: <Date | null>null,
    autoClose: <any[]> [{
      value: 'allMembersVoted',
      enabled: false
    }],
    endsAt: <Date | null>null
  };
  deadline = <any>null;
  numberOfDaysLeft = 0;
  endsAt = <any>{
    date: null,
    min: 0,
    h: 0,
    timezone: (new Date().getTimezoneOffset() / -60),
    timeFormat: '24'
  };

  errors = <any>null;
  extraOptions = <any>{
    neutral: {
      value: 'Neutral',
      enabled: false
    }, // enabled - is the option enabled by default
    veto: {
      value: 'Veto',
      enabled: false
    }
  };

  predefinedOptions = <any> {
    yes: {
      value: 'Yes',
      enabled: true
    },
    no: {
      value: 'No',
      enabled: true
    }
  }

  customOptions = [
    {value: ''},
    {value: ''},
    {value: ''},
  ]
  reminder = false;
  reminderOptionsList = [{ value: 1, unit: 'days' }, { value: 2, unit: 'days' }, { value: 3, unit: 'days' }, { value: 1, unit: 'weeks' }, { value: 2, unit: 'weeks' }, { value: 1, unit: 'month' }];
  reminderOptions = <any[]>[];
  constructor(
    public TopicService: TopicService,
    private cd: ChangeDetectorRef,
    public TopicVoteService: TopicVoteService,
    public Translate: TranslateService,
    public Notification: NotificationService,
    @Inject(ActivatedRoute) public route: ActivatedRoute,
    public router: Router
  ) {
    this.setTimeZones();
  }

  ngOnInit(): void {
    if (!this.vote) {
      this.vote = Object.assign({}, this.voteDefault);
    }
    this.topicId = this.topic.id;

    if (this.vote.endsAt) {
      this.deadline = new Date(this.vote.endsAt);
      this.endsAt.date = this.deadline;
      this.endsAt.min = this.deadline.getMinutes();
      this.endsAt.h = this.deadline.getHours();
  //    this.setEndsAtTime();
    }
    if (this.vote.type === this.VOTE_TYPES.multiple) {
      this.customOptions = [];
    }
    this.vote.options.forEach((opt: any) => {
      const val = opt.value.toLowerCase();

      switch (val) {
        case 'yes':
          this.predefinedOptions.yes.enabled = true;
          break;
        case 'no':
          this.predefinedOptions.no.enabled = true;
          break;
        case 'neutral':
          this.extraOptions.neutral.enabled = true;
          break;
        case 'veto':
          this.extraOptions.veto.enabled = true;
          break;
        default:
          this.customOptions.push(opt);
      }
      this.cd.detectChanges();
    })
    if (this.vote.reminderTime) {
      this.reminder = true;
      this.setReminderOptions();
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

  toggleOption(option: string) {
    switch (option.toLowerCase()) {
      case 'yes':
        this.predefinedOptions.yes.enabled = !this.predefinedOptions.yes.enabled;
        break;
      case 'no':
        this.predefinedOptions.no.enabled = !this.predefinedOptions.no.enabled;
        break;
      case 'neutral':
        this.extraOptions.neutral.enabled = !this.extraOptions.neutral.enabled;
        break;
      case 'veto':
        this.extraOptions.veto.enabled = !this.extraOptions.veto.enabled;
        break;
    }
    this.filterOptions();
  }

  setVoteType(voteType: string) {
    if (!this.TopicService.canEditDescription(this.topic)) return;
    if (voteType == this.VOTE_TYPES.multiple) {
      this.vote.type = voteType;
      if (!this.vote.options.length)
      this.vote.maxChoices = 1;
    } else {
      this.vote.type = this.VOTE_TYPES.regular;
    }
    this.filterOptions();
  };

  addOption() {
    this.customOptions.push({ value: '' });
  };

  removeOption(key: number) {
    this.customOptions.splice(key, 1);
    this.filterOptions();
  };

  optionsCountUp(type?: string) {
    const options = this.vote.options.filter((option: any) => {
      return !!option.value;
    });
    let count = options.length;
    if (this.extraOptions.neutral.enabled) count = count-1;
    if (this.extraOptions.veto.enabled) count = count-1;
    if (type === 'min' && this.vote.minChoices < count) {
      this.vote.minChoices++;
      if (this.vote.minChoices > this.vote.maxChoices) {
        this.vote.maxChoices = this.vote.minChoices;
      }
    } else if (this.vote.maxChoices < count) {
      this.vote.maxChoices++;
    }
  };

  optionsCountDown(type?: string) {
    if (type === 'min' && this.vote.minChoices > 1) {
      this.vote.minChoices--;
    }
    else if (this.vote.maxChoices > 1) {
      this.vote.maxChoices--;
      if (this.vote.minChoices > this.vote.maxChoices) {
        this.vote.minChoices = this.vote.maxChoices;
      }
    }
  };

  getStepNum(num: number) {
    if (this.vote.type === this.VOTE_TYPES.multiple) num++;
    return num;
  };

  getDeadline() {
    if (this.deadline === true) {
      this.setEndsAtTime();
    }
    return this.deadline;
  }

  getOptionsLimit () {
    let count = this.vote.options.length;

    if (this.extraOptions.neutral.enabled) {count = count-1;}
    if (this.extraOptions.veto.enabled) {count = count-1;}

    if (this.vote.maxChoices > count && count > 0) this.vote.maxChoices = count;
    if (this.vote.minChoices > count && count > 0) this.vote.minChoices = count;
    return count;
  }

  toggleDeadline() {
    if (!this.deadline) {
      this.endsAt.h = new Date().getHours();
      this.endsAt.min = Math.ceil(new Date().getMinutes() / 5) * 5;
      this.setEndsAtTime();
    } else {
      this.deadline = null;
      this.vote.endsAt = this.deadline;
    }
  }

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
    this.vote.endsAt = this.deadline;
    this.daysToVoteEnd();

    this.setReminderOptions();
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

  timeFormatDisabled () {
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

  getTimeZoneName(value: number) {
    return (this.timezones.find((item) => { return item.value === value })).name;
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

  saveVoteSettings() {
    if (this.saveVote) {
      this.filterOptions();
      if (!this.reminder) {
        this.vote.reminderTime = this.vote.reminderTime = null;
      }

      if (this.deadline) {
        this.vote.endsAt = this.deadline
      }
      this.saveVote.emit(this.vote);
    }
  }

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

  filterOptions() {
    let options = [];
    if (this.vote.type === this.VOTE_TYPES.regular) {
      this.vote.options = [];
      for (let o in this.predefinedOptions) {
        const option = this.predefinedOptions[o];
        if (option.enabled) {
          options.push({ value: option.value });
        }
      }
    } else {
      for (let key in this.customOptions) {
        options.push(this.customOptions[key]);
      }
    }
    for (let o in this.extraOptions) {
      const option = this.extraOptions[o];
      if (option.enabled) {
        options.push({ value: option.value });
      }
    }
    this.vote.options = Object.assign([], options);
    this.vote.options = this.vote.options.filter((option: any) => {
      return !!option.value
    });
  }

  displayOptInput(option: any) {
    return (Object.keys(this.extraOptions).indexOf(option.value?.toLowerCase()) === -1)
  }

  updateVote() {
    this.filterOptions();
    const updateVote = Object.assign({topicId: this.topic.id}, this.vote);
    if (this.deadline) {
      updateVote.endsAt = this.deadline;
    }
    return this.TopicVoteService.update(updateVote).pipe(take(1)).subscribe();
  }

  createVote() {
    this.filterOptions();
    this.Notification.removeAll();

    if (!this.reminder) {
      this.vote.reminderTime = this.vote.reminderTime = null;
    }

    if (this.deadline) {
      this.vote.endsAt = this.deadline;
    }
    const saveVote:any = Object.assign({topicId: this.topicId}, this.vote);
    saveVote.autoClose = this.CONF.autoClose;
    this.TopicVoteService.save(saveVote)
      .pipe(take(1))
      .subscribe({
        next: (vote) => {
          this.TopicService.reloadTopic();
        /*  this.router.navigate(['/topics', this.topic.id, 'votes', vote.id]);
          this.route.url.pipe(take(1)).subscribe();*/
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
  };

  toggleDelegation ($event: any) {
    if ($event.target.nodeName === "INPUT") {
      return;
    }

    return this.vote.delegationIsAllowed =!this.vote.delegationIsAllowed;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.customOptions, event.previousIndex, event.currentIndex);
    this.filterOptions();
  }

}
@Component({
  selector: 'topic-vote-create-dialog',
  templateUrl: './topic-vote-create-dialog.component.html',
  styleUrls: ['./topic-vote-create-dialog.component.scss']
})
export class TopicVoteCreateDialogComponent extends TopicVoteCreateComponent {
  override topic!: Topic;
  tabs = [...Array(4).keys()];
  tabActive = 1;


  private dialog = inject(DialogService);
  private data = inject(DIALOG_DATA);

  override ngOnInit(): void {
    if (!this.vote) {
      this.vote = Object.assign({}, this.voteDefault);
    }
    this.topic = this.data.topic;
    this.topicId = this.topic.id;

    if (this.topic.voteId) {
      this.router.navigate(['/topics', this.topic.id, 'votes', this.topic.voteId]);
    }

    this.vote.options.forEach((opt: any) => {
      const val = opt.value.toLowerCase();

      switch (val) {
        case 'yes':
          this.predefinedOptions.yes.enabled = true;
          break;
        case 'no':
          this.predefinedOptions.no.enabled = true;
          break;
        case 'neutral':
          this.extraOptions.neutral.enabled = true;
          break;
        case 'veto':
          this.extraOptions.veto.enabled = true;
          break;
      }
    })
    if (this.vote.reminderTime) {
      this.reminder = true;
      this.setReminderOptions();
    }
  }


  isNextDisabled () {
    if (this.tabActive === 2 && (!this.vote.type || !this.vote.description)) return true;
    if (this.tabActive === 3 && (!this.vote.authType || this.vote.options.length < 2)) return true;
    return false;
  }

  tabNext() {
    if (this.tabActive === 2 && (!this.vote.type || !this.vote.description)) return;
    if (this.tabActive >= 3) this.filterOptions();
    (this.tabActive < 4) ? this.tabActive = this.tabActive + 1 : this.createVote()
  }

  override createVote() {
    this.Notification.removeAll();

    if (!this.reminder) {
      this.vote.reminderTime = this.vote.reminderTime = null;
    }

    if (this.deadline) {
      this.vote.endsAt = this.deadline
    }
    const saveVote:any = Object.assign(this.vote, {topicId: this.topicId || this.topic.id});
    saveVote.autoClose = this.CONF.autoClose;
    if (!saveVote.description) {
      this.Notification.addError('VIEWS.VOTE_CREATE.ERROR_MISSING_QUESTION');
      return;
    }
    this.TopicVoteService.save(saveVote)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.TopicService.reloadTopic();
          this.router.navigate(['/topics', this.topic.id], { fragment: 'voting' });
          this.route.url.pipe(take(1)).subscribe();
          this.Notification.addSuccess('VIEWS.VOTE_CREATE.SUCCESS_VOTE_STARTED');
          this.dialog.closeAll();
        },
        error: (res:any) => {
          console.debug('createVote() ERR', res, res.errors, this.vote.options);
          this.errors = res.errors;
          Object.values(this.errors).forEach((message) => {
            if (typeof message === 'string')
              this.Notification.addError(message);
          });
        }
      });
  };
}
