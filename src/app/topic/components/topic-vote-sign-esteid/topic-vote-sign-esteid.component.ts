import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicVoteSignData } from '../topic-vote-sign/topic-vote-sign.component';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { take, interval, takeWhile, switchMap, map, catchError, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AppService } from 'src/app/services/app.service';
import { TranslateService } from '@ngx-translate/core';
declare let hwcrypto: any;

@Component({
  selector: 'app-topic-vote-sign-esteid',
  templateUrl: './topic-vote-sign-esteid.component.html',
  styleUrls: ['./topic-vote-sign-esteid.component.scss']
})
export class TopicVoteSignEsteidComponent implements OnInit {
  topic!: Topic;
  options!: any;
  isLoading = false;
  phoneNumber?: string;
  pid?: number;
  challengeID?: number | null;
  wWidth = window.innerWidth;
  isLoadingIdCard = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicVoteSignData,
    private dialog: MatDialog,
    private Notification: NotificationService,
    public TopicVoteService: TopicVoteService,
    private translate: TranslateService,
    private app: AppService) {
    this.topic = data.topic;
    this.options = data.options;
  }

  ngOnInit(): void {
  }

  doSignWithMobile() {
    console.debug('doSignWithMobile()');

    this.isLoading = true;

    if (this.phoneNumber?.indexOf('+') !== 0) {
      this.phoneNumber = '+'+this.phoneNumber;
    }

    const userVote = {
      voteId: this.topic.voteId,
      topicId: this.topic.id,
      options: this.options,
      pid: this.pid,
      certificate: null,
      phoneNumber: this.phoneNumber
    };

    this.TopicVoteService.cast(userVote)
      .pipe(take(1),
        catchError((err) => {
          this.isLoading = false;
          return of(err);
        }))
      .subscribe({
        next: (voteInitResult) => {
          this.isLoading = false;
          if (voteInitResult.challengeID && voteInitResult.token) {
            this.challengeID = voteInitResult.challengeID;
            const token = voteInitResult.token;
            return this.pollVoteMobileSignStatus(token, 3000, 80);
          }
        },
        error: (err) => {
          this.isLoading = false;
        }
      })
  };

  doSignWithCard() {
    this.isLoadingIdCard = true;
    hwcrypto
      .getCertificate({})
      .then((certificate: any) => {
        const userVote = {
          voteId: this.topic.voteId,
          topicId: this.topic.id,
          options: this.options,
          certificate: certificate.hex
        };
        this.TopicVoteService.cast(userVote)
          .pipe(take(1),
            catchError((err) => {
              this.isLoadingIdCard = false;
              return of(err);
            }))
          .subscribe(async (voteResponse) => {
            if (voteResponse.signedInfoDigest && voteResponse.token && voteResponse.signedInfoHashType) {
              const signature = await hwcrypto.sign(certificate, { hex: voteResponse.signedInfoDigest, type: voteResponse.signedInfoHashType }, {});
              const signTopicVote = {
                id: this.topic.voteId,
                topicId: this.topic.id,
                signatureValue: signature.hex,
                token: voteResponse.token
              };

              this.TopicVoteService.sign(signTopicVote).pipe(take(1)).subscribe({
                next: (signed) => {
                  this.isLoadingIdCard = false;
                  this.dialog.closeAll();
                  this.Notification.addSuccess('VIEWS.TOPICS_TOPICID.MSG_VOTE_REGISTERED');
                },
                error: (err) => {
                  this.isLoadingIdCard = false;
                }
              }
              );
            }
          })
      }, (err: any) => {
        this.isLoading = false;
        this.isLoadingIdCard = false;
        this.challengeID = null;

        let msg = null;
        if (err instanceof Error) { //hwcrypto and JS errors
          msg = this.app.hwCryptoErrorToTranslationKey(err);
        } else { // API error response
          msg = err.status.message;
        }
        this.Notification.addError(msg);
      });
  };

  pollVoteMobileSignStatus(token: string, milliseconds: number, retry: number) {
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
      error: (err) => {
        console.error(err);
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
