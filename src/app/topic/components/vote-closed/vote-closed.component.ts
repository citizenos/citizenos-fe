import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { Vote } from 'src/app/interfaces/vote';
import { TopicService } from 'src/app/services/topic.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';

@Component({
  selector: 'vote-closed',
  templateUrl: './vote-closed.component.html',
  styleUrls: ['./vote-closed.component.scss']
})
export class VoteClosedComponent implements OnInit {
  @Input() topic!: Topic;
  @Input() vote!: Vote;

  VOTE_AUTH_TYPES = this.TopicVoteService.VOTE_AUTH_TYPES;
  public multipleWinners = false;
  public showInfoWinners = false;
  constructor(private TopicService: TopicService, private TopicVoteService: TopicVoteService) { }

  ngOnInit(): void {
  }

  canVote() {
    return this.TopicVoteService.canVote(this.topic);
  }

  canUpdate() {
    return this.TopicService.canUpdate(this.topic);
  }

  hasVoteEndedExpired() {
    return this.TopicVoteService.hasVoteEndedExpired(this.topic, this.vote);
  };

  hasVoteEnded() {
    return this.TopicVoteService.hasVoteEnded(this.topic, this.vote);
  };

  sendToFollowUp(stateSuccess: string) {
    //  this.app.topicsSettings = false;
    this.TopicService.changeState(this.topic, 'followUp', stateSuccess);
  };

  downloadContainer(includeCSV?:boolean) {
    let url = this.vote.downloads.bdocFinal;
    if (!url) return;
    if (includeCSV) {
      url += '&include[]=csv';
    }

    window.location.href = url;
  };
}
