import { Component, Inject, OnInit } from '@angular/core';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicVoteSignData } from '../topic-vote-sign/topic-vote-sign.component';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { take, interval, takeWhile, switchMap, map, catchError, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-topic-vote-sign-smartid',
  templateUrl: './topic-vote-sign-smartid.component.html',
  styleUrls: ['./topic-vote-sign-smartid.component.scss']
})
export class TopicVoteSignSmartidComponent implements OnInit {
  signForm = new UntypedFormGroup({
    countryCode: new UntypedFormControl(''),
    pid: new UntypedFormControl(''),
  });

  topic!: Topic;
  options!: any;
  isLoading = false;
  countryCode?: string;
  pid?: number;
  challengeID?: number | null;
  wWidth = window.innerWidth;

  constructor(@Inject(DIALOG_DATA) public data: TopicVoteSignData,
  private dialog: DialogService,
  private Notification: NotificationService,
  private translate: TranslateService,
  public TopicVoteService: TopicVoteService) {
    this.topic = data.topic;
    this.options = data.options;
  }

  ngOnInit(): void {
  }
  doSignWithSmartId() {
    console.debug('doSignWithSmartId()');

    this.isLoading = true;

    const userVote = {
      voteId: this.topic.voteId,
      topicId: this.topic.id,
      options: this.options,
      pid: this.signForm.value.pid,
      countryCode: this.signForm.value.countryCode
    };

    this.TopicVoteService.cast(userVote)
      .pipe(take(1))
      .subscribe({
        next: (voteInitResult) => {
          this.isLoading = false;
          if (voteInitResult.challengeID && voteInitResult.token) {
            this.challengeID = voteInitResult.challengeID;
            const token = voteInitResult.token;
            return this.pollVoteSignStatus(token, 3000, 80);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        }
      });
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
        return (res?.status.code === 20001)
      }, true),
      map((res) => { return res?.data || {} })
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.challengeID = null;
        this.dialog.closeAll();
        this.Notification.addSuccess('VIEWS.TOPICS_TOPICID.MSG_VOTE_REGISTERED');
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.challengeID = null;
      }
    });
  };

  getOptionValueText(option: string) {
    const optionvalue = this.translate.instant(('VIEWS.TOPICS_TOPICID.VOTE_LBL_OPTION_' + option).toUpperCase());
    if (optionvalue.indexOf('VIEWS.TOPICS_TOPICID.VOTE_LBL_OPTION_') == -1) {
      return optionvalue;
    }
    return option;
  }
}
