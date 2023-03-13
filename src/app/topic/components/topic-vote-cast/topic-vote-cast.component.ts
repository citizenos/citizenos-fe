import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicService } from 'src/app/services/topic.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { TopicVoteSignComponent } from '../topic-vote-sign/topic-vote-sign.component';
@Component({
  selector: 'topic-vote-cast',
  templateUrl: './topic-vote-cast.component.html',
  styleUrls: ['./topic-vote-cast.component.scss']
})
export class TopicVoteCastComponent implements OnInit {
  @Input() vote!: any;
  @Input() topic!: Topic;

  STATUSES = this.TopicService.STATUSES;
  VISIBILITY = this.TopicService.VISIBILITY;
  VOTE_TYPES = this.TopicVoteService.VOTE_TYPES;
  VOTE_AUTH_TYPES = this.TopicVoteService.VOTE_AUTH_TYPES;
  userHasVoted: boolean = false;

  constructor(
    private dialog: MatDialog,
    private Notification: NotificationService,
    public AuthService: AuthService,
    private TopicService: TopicService,
    private TopicVoteService: TopicVoteService,
  ) { }

  ngOnInit(): void {
  }

  canVote() {
    this.topic.vote = this.vote;
    return this.TopicVoteService.canVote(this.topic);
  }

  isRadio(vote: any, option: any) {
    if (option.value === 'Neutral' || option.value === 'Veto') return true;
    if (vote.type === 'regular' || vote.maxChoices === 1) return true;

    return false;
  };


  doVote(option?: any) {
    let options = [];
    //if (!$scope.topic.canVote()) return;
    if (!option) {
      options = this.vote.options.rows.filter((option: any) => {
        option.optionId = option.id;
        return !!option.selected;
      });
    } else {
      options = [option];
    }
    if (options.length > this.vote.maxChoices || options.length < this.vote.minChoices && options[0].value !== 'Neutral' && options[0].value !== 'Veto') {
      this.Notification.addError('MSG_ERROR_SELECTED_OPTIONS_COUNT_DOES_NOT_MATCH_VOTE_SETTINGS');
      return;
    }
    //  this.TopicVoteService.options = options;
    if (this.vote.authType === this.VOTE_AUTH_TYPES.hard) {
      const signDialog = this.dialog
        .open(TopicVoteSignComponent, {
          data: {
            topic: this.topic,
            options
          }
        });

      return;
    } else {
      options.forEach((dOption: any) => {
        dOption.optionId = dOption.id;
      });
      this.TopicVoteService
        .cast({ voteId: this.vote.id, topicId: this.topic.id, options: options })
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            console.log(data);
            this.vote.topicId = this.topic.id;
            this.Notification.addSuccess('VIEWS.TOPICS_TOPICID.MSG_VOTE_REGISTERED');
          }, error: (err) => {
            console.error(err);
          }
        });
    }
  }

  hasVoteEndedExpired() {
    return this.TopicVoteService.hasVoteEndedExpired(this.topic, this.vote);
  };

  hasVoteEnded() {
    return this.TopicVoteService.hasVoteEnded(this.topic, this.vote);
  };

  selectOption(option: any) {
    if (!this.canVote()) {
      return false;
    }
    this.vote.options.rows.forEach((opt: any) => {
      if (option.value === 'Neutral' || option.value === 'Veto' || this.vote.maxChoices === 1) {
        opt.selected = false;
      } else if (opt.value === 'Neutral' || opt.value === 'Veto' || this.vote.maxChoices === 1) {
        opt.selected = false;
      }
    });

    option.optionId = option.id;

    const selected = this.vote.options.rows.filter((option: any) => {
      return !!option.selected;
    });

    const isSelected = selected.find((item: any) => {
      if (item.id === option.id) return item;
    });

    if (selected.length >= this.vote.maxChoices && !isSelected) return;
    option.selected = !option.selected;
    return;
  };
}
