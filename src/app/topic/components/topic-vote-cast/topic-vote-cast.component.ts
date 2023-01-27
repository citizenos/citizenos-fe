import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { AuthService } from 'src/app/services/auth.service';
import { TopicService } from 'src/app/services/topic.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
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
    public AuthService: AuthService,
    private TopicService: TopicService,
    private TopicVoteService: TopicVoteService,
  ) { }

  ngOnInit(): void {
  }

  canVote() {
    return this.TopicVoteService.canVote(this.topic);
  }

  isRadio(vote: any, option: any) {
    if (option.value === 'Neutral' || option.value === 'Veto') return true;
    if (vote.type === 'regular' || vote.maxChoices === 1) return true;

    return false;
  };


  doVote(option?: any) {
    /*let options = [];
    //if (!$scope.topic.canVote()) return;
    if (!option) {
      options = this.vote.options.rows.filter((option) => {
        option.optionId = option.id;
        return !!option.selected;
      });
    } else {
      options = [option];
    }
    if (options.length > this.vote.maxChoices || options.length < this.vote.minChoices && options[0].value !== 'Neutral' && options[0].value !== 'Veto') {
      this.sNotification.addError('MSG_ERROR_SELECTED_OPTIONS_COUNT_DOES_NOT_MATCH_VOTE_SETTINGS');
      return;
    }
    this.TopicVoteService.options = options;
    if (this.vote.authType === this.VOTE_AUTH_TYPES.hard) {
      const signDialog = this.ngDialog
        .open({
          template: '<topic-vote-sign options="options"></topic-vote-sign>',
          plain: true,
          preCloseCallback: (data) => {
            if (data) {
              this.vote.topicId = this.topic.id;

              this.TopicVote
                .get(this.vote)
                .then((vote) => {
                  this.vote = vote;
                  this.vote.options.rows.forEach((option) => {
                    data.options.forEach((dOption) => {
                      option.optionId = option.id;
                      if (option.id === dOption.optionId) {
                        option.selected = true;
                      }
                    });
                  });
                  this.vote.downloads = { bdocVote: data.bdocUri };
                  this.userHasVoted = true;
                });
              return true;
            }
          }
        });

      signDialog.closePromise.then((data) => {
        if (data.value) {
          this.sNotification.addSuccess('VIEWS.TOPICS_TOPICID.MSG_VOTE_REGISTERED');
        }
      });

      return;
    } else {
      options.forEach((dOption) => {
        dOption.optionId = dOption.id;
      });
      this.TopicVote
        .cast({ voteId: this.vote.id, topicId: this.topic.id, options: options })
        .then((data) => {
          this.vote.topicId = this.topic.id;
          this.sNotification.addSuccess('VIEWS.TOPICS_TOPICID.MSG_VOTE_REGISTERED');
          this.getVote();
        });
    }*/
  }

  hasVoteEndedExpired() {
    return this.TopicVoteService.hasVoteEndedExpired(this.topic, this.vote);
  };

  hasVoteEnded() {
    return this.TopicVoteService.hasVoteEnded(this.topic, this.vote);
  };

  selectOption(option: any) { }
}
