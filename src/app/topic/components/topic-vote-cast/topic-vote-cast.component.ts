import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicService } from 'src/app/services/topic.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { VoteDelegationService } from 'src/app/services/vote-delegation.service';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { TopicVoteSignComponent } from '../topic-vote-sign/topic-vote-sign.component';
import { TopicVoteDeadlineComponent } from '../topic-vote-deadline/topic-vote-deadline.component';
import { TopicVoteDelegateComponent } from '../topic-vote-delegate/topic-vote-delegate.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
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
  editVote: boolean = false;

  constructor(
    public app: AppService,
    private dialog: MatDialog,
    private Notification: NotificationService,
    public AuthService: AuthService,
    private TopicService: TopicService,
    private TopicVoteService: TopicVoteService,
    private VoteDelegationService: VoteDelegationService
  ) { }

  ngOnInit(): void {
    this.vote.options.rows.forEach((option: any) => {
      if (option.selected) {
        this.userHasVoted = true;
      }
    })
    if (this.vote.delegation) {
      this.userHasVoted = true;
    }
  }

  canVote() {
    this.topic.vote = this.vote;
    return this.TopicVoteService.canVote(this.topic);
  }

  canDelegate() {
    return this.TopicVoteService.canDelegate(this.topic);
  }

  canSubmit() {
    if (!this.vote.options || !Array.isArray(this.vote.options.rows)) return false;
    const options = this.vote.options.rows.filter((option: any) => {
      return !!option.selected;
    });

    if (options && options.length === 1 && (options[0].value === 'Neutral' || options[0].value === 'Veto')) {
      return true;
    }

    if (options.length > this.vote.maxChoices || options.length < this.vote.minChoices)
      return false;

    return true;
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
          next: () => {
            this.vote.topicId = this.topic.id;
            this.TopicVoteService.get({ voteId: this.vote.id, topicId: this.topic.id }).pipe(take(1)).subscribe({
              next: (vote) => {
                this.vote = vote;
                this.topic.vote = vote;
              },
              error: (err) => {
                console.error(err);
              }
            });
            this.Notification.removeAll();
            this.Notification.addSuccess('VIEWS.TOPICS_TOPICID.MSG_VOTE_REGISTERED');
            this.editVote = false;
            this.userHasVoted = true;
          }, error: (err) => {
            console.error(err);
          }
        });
    }
  }

  saveVote () {
    const saveVote:any = Object.assign(this.vote, {topicId: this.topic.id});
    this.TopicVoteService.update(saveVote)
      .pipe(take(1))
      .subscribe({
        next: (vote) => {
          this.vote = vote;
          console.log(vote);
          this.TopicService.reloadTopic();
          this.dialog.closeAll();
        },
        error: (res) => {
          console.debug('closeVoting() ERR', res, res.errors, this.vote.options);
          Object.values(res).forEach((message) => {
            if (typeof message === 'string')
              this.Notification.addError(message);
          });
        }
      });
  }
  closeVoting() {
    this.vote.endsAt = new Date();
    this.saveVote();
  }

  sendVoteReminder () {
    this.vote.reminderTime = new Date();
    this.saveVote();
  }

  editDeadline () {
    const voteDeadlineDialog = this.dialog.open(TopicVoteDeadlineComponent, {
      data: {
      vote: this.vote,
      topic: this.topic
    }});
  }
  hasVoteEndedExpired() {
    return this.TopicVoteService.hasVoteEndedExpired(this.topic, this.vote);
  };

  hasVoteEnded() {
    return this.TopicVoteService.hasVoteEnded(this.topic, this.vote);
  };

  delegate() {
    if (!this.vote.delegation) {
      const delegateDialog = this.dialog
        .open(TopicVoteDelegateComponent, {
          data: {
            topic: this.topic
          }
        });
    }
  };

  doRevokeDelegation() {
    const revokeDialog = this.dialog
      .open(
        ConfirmDialogComponent, {
        data: {
          level: 'voting',
          heading: 'MODALS.TOPIC_VOTE_REVOKE_DELEGATION_CONFIRM_HEADING',
          description: 'MODALS.TOPIC_VOTE_REVOKE_DELEGATION_CONFIRM_TXT_ARE_YOU_SURE',
          confirmBtn: 'MODALS.TOPIC_VOTE_REVOKE_DELEGATION_CONFIRM_YES',
          closeBtn: 'MODALS.TOPIC_VOTE_REVOKE_DELEGATION_CONFIRM_NO',
          svg: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M26.3432 15.9229L27.0634 10L21.1505 10.7214L23.1001 12.6743L15.7221 20.0647L17.1292 21.4742L24.5072 14.0838L26.3432 15.9229Z" fill="#5AB467"/>
          <path d="M17.9282 29L28 18.9113L26.5929 17.5018L17.9352 26.174L13.4071 21.6524L12 23.0618L17.9282 29Z" fill="#5AB467"/>
          <path d="M27 27L32 32" stroke="#5AB467" stroke-width="4" stroke-linecap="square"/>
          <path d="M8 8L13 13" stroke="#5AB467" stroke-width="4" stroke-linecap="square"/>
          <rect x="2" y="2" width="36" height="36" rx="18" stroke="#5AB467" stroke-width="4"/>
          </svg>
          `
        }
      });

    revokeDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.VoteDelegationService
          .delete({ topicId: this.topic.id, voteId: this.vote.id })
          .pipe(
            take(1)
          ).subscribe({
            next: () => {
              this.TopicService.reloadTopic();
            },
            error: (err) => {
              console.error('ERROR', err)
            }
          })
      }
    });
  }

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

  voteGraphDasharray() {
    let val = 2 * 3.14 * 20;
    return `${val}px`;
  }
  voteGraphDashOffset(pecentage: number) {
    let val = (2 * 3.14 * 20) * ((100 - pecentage) / 100);
    return `${val}px`;
  }

  downloadContainer(includeCSV?: boolean) {
    let url = this.vote.downloads.bdocFinal;
    if (!url) return;
    if (includeCSV) {
      url += '&include[]=csv';
    }
    window.location.href = url;
  };
}
