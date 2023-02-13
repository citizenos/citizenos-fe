import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicVoteSignData } from '../topic-vote-sign/topic-vote-sign.component';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { take, interval, takeWhile, switchMap, map, catchError, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-topic-vote-sign-smartid',
  templateUrl: './topic-vote-sign-smartid.component.html',
  styleUrls: ['./topic-vote-sign-smartid.component.scss']
})
export class TopicVoteSignSmartidComponent implements OnInit {
  signForm = new FormGroup({
    countryCode: new FormControl(''),
    pid: new FormControl(''),
  });

  topic!: Topic;
  options!: any;
  isLoading = false;
  countryCode?: string;
  pid?: number;
  challengeID?: number | null;
  wWidth = window.innerWidth;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicVoteSignData, private dialog: MatDialog, private Notification: NotificationService, public TopicVoteService: TopicVoteService) {
    this.topic = data.topic;
    this.options = data.options;
  }

  ngOnInit(): void {
  }
  doSignWithSmartId() {
    console.debug('doSignWithMobile()');

    this.isLoading = true;

    const userVote = {
      voteId: this.topic.voteId,
      topicId: this.topic.id,
      options: this.options,
      pid: this.pid,
      certificate: null,
      countryCode: this.countryCode
    };

    this.TopicVoteService.cast(userVote)
      .pipe(take(1),
        catchError((err) => {
          this.isLoading = false;
          console.error(err);
          return of(err);
        }))
      .subscribe((voteInitResult) => {
        this.isLoading = false;
        if (voteInitResult.challengeID && voteInitResult.token) {
          this.challengeID = voteInitResult.challengeID;
          const token = voteInitResult.token;
          return this.pollVoteSignStatus(token, 3000, 80);
        }

      })
  };

  pollVoteSignStatus(token: string, milliseconds: number, retry: number) {
    const delay = interval(milliseconds);
    this.isLoading = true;
    const voteResult = delay.pipe(
      switchMap((data) => {
        return this.TopicVoteService.status({ topicId: this.topic.id, voteId: this.topic.voteId, token: token });
      })
    );
    voteResult.pipe(
      takeWhile((res: any,) => {
        return (res.status.code === 20001)
      }, true),
      map(res => res.data),
      catchError((error) => {
        console.log('ERROR', error);
        this.isLoading = false;
        this.challengeID = null;
        return of(error);
      })).subscribe((response) => {
        this.isLoading = false;
        this.challengeID = null;
        this.dialog.closeAll();
        this.Notification.addSuccess('VIEWS.TOPICS_TOPICID.MSG_VOTE_REGISTERED');
      });
  };
}
