import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-topic-settings',
  templateUrl: './topic-settings.component.html',
  styleUrls: ['./topic-settings.component.scss']
})
export class TopicSettingsComponent implements OnInit {
  @Input() topic!: Topic;
  tabSelected = 'settings'
  errors: any = {};
  VISIBILITY = this.TopicService.VISIBILITY;
  reminder = false;
  reminderOptions = [{ value: 1, unit: 'days' }, { value: 2, unit: 'days' }, { value: 3, unit: 'days' }, { value: 1, unit: 'weeks' }, { value: 2, unit: 'weeks' }, { value: 1, unit: 'month' }];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private TopicService: TopicService,
    private TranslateService: TranslateService,
    private TopicVoteService: TopicVoteService,
    private TopicMemberGroupService: TopicMemberGroupService,
    private TopicMemberUserService: TopicMemberUserService
  ) { }

  ngOnInit(): void {
  }

  canEdit() {
    return this.TopicService.canEdit(this.topic);
  }

  canDelete() {
    return this.TopicService.canDelete(this.topic);
  }

  canSendToFollowUp() {
    return this.TopicService.canSendToFollowUp(this.topic);
  }

  canLeave() {
    return this.TopicService.canLeave();
  }

  selectTab(tab: string) {
    this.tabSelected = tab;
  }


  checkHashtag() {
    let length = 0;
    const str = this.topic.hashtag;
    const hashtagMaxLength = 59;

    if (str) {
      length = str.length;
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) length++;
        else if (code > 0x7ff && code <= 0xffff) length += 2;
        if (code >= 0xDC00 && code <= 0xDFFF) i++; //trail surrogate
      }
    }

    if ((hashtagMaxLength - length) < 0) {
      this.errors = { hashtag: 'MSG_ERROR_40000_TOPIC_HASHTAG' };
    } else if (this.errors && this.errors.hashtag) {
      this.errors.hashtag = null;
    }
  };
  doDeleteHashtag() {
    this.topic.hashtag = null;
  }

  canChangeVisibility() {
    /*  const publicGroups = this.TopicMemberGroupService.item$.filter((group) => group.visibility === this.Group.VISIBILITY.public);
      return (this.canDelete() && (this.topic.visibility === this.Topic.VISIBILITY.private || publicGroups.length === 0));*/
  }

  selectedReminderOption() {
    if (this.topic.vote?.endsAt && this.topic.vote?.reminderTime) {
      let voteDeadline = new Date(this.topic.vote?.endsAt);
      let reminder = new Date(this.topic.vote.reminderTime);
      let diffTime = voteDeadline.getTime() - reminder.getTime();
      const dayTime = 1000 * 3600 * 24;
      const days = Math.ceil(diffTime / (dayTime));
      const weeks = Math.ceil(diffTime / (dayTime * 7));
      const months = (voteDeadline.getMonth() - reminder.getMonth() +
        12 * (voteDeadline.getFullYear() - reminder.getFullYear()));
      const item = this.reminderOptions.find((item:any) => {
        if (item.value === days && item.unit === 'days') return item;
        else if (item.value === weeks && item.unit === 'weeks') return item;
        else if (item.value === months && item.unit === 'month') return item;
      });
      if (item) {
        return this.TranslateService.instant('OPTION_' + item.value + '_' + item.unit.toUpperCase());
      }
    }
  };

  isVisibleReminderOption(time: any) {
    if (this.topic.vote?.endsAt) {
      let timeItem = new Date(this.topic.vote.endsAt);
      switch (time.unit) {
        case 'weeks':
          timeItem.setDate(timeItem.getDate() - (time.value * 7));
          break;
        case 'month':
          timeItem.setMonth(timeItem.getMonth() - time.value);
          break
        default:
          timeItem.setDate(timeItem.getDate() - time.value);
      }
      if (timeItem > new Date()) return true;
    }

    return false;
  };

  setVoteReminder(time: any) {
    if (this.topic.vote) {
      let reminderTime = new Date();
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
      this.topic.vote.reminderTime = reminderTime;
      this.doEditVoteDeadline();

    }
  };

  doEditVoteDeadline() {
    const vote: any = { topicId: this.topic.id };
    if (!this.reminder && !this.topic.vote?.reminderSent) {
      vote.reminderTime = null;
    }
    return this.TopicVoteService
      .update(vote)
      .pipe(take(1))
      .subscribe((voteValue) => {
        if (voteValue.reminderTime && !voteValue.reminderSent) {
          this.reminder = true;
        } else {
          this.reminder = false;
        }
      });
  };

  doLeaveTopic() {
    this.TopicMemberUserService.doLeaveTopic(this.topic, [this.TranslateService.currentLang, 'my', 'topics']);
  };

  doDeleteTopic() {
    this.TopicService.doDeleteTopic(this.topic, [this.TranslateService.currentLang, 'my', 'topics']);
  };
}
