import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicVoteSignData } from '../topic-vote-sign/topic-vote-sign.component';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { take, interval, takeWhile, switchMap, map, catchError, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicVoteSignData, private dialog: MatDialog, private Notification: NotificationService, public TopicVoteService: TopicVoteService) {
    this.topic = data.topic;
    this.options = data.options;
  }

  ngOnInit(): void {
  }

  doSignWithMobile() {
    console.debug('doSignWithMobile()');

    this.isLoading = true;

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
          console.error(err);
          return of(err);
        }))
      .subscribe((voteInitResult) => {
        this.isLoading = false;
        if (voteInitResult.challengeID && voteInitResult.token) {
          this.challengeID = voteInitResult.challengeID;
          const token = voteInitResult.token;
          return this.pollVoteMobileSignStatus(token, 3000, 80);
        }
      })
  };

  hwCryptoErrorToTranslationKey(err: any) {
    const errorKeyPrefix = 'MSG_ERROR_HWCRYPTO_';

    switch (err.message) {
      case hwcrypto.NO_CERTIFICATES:
      case hwcrypto.USER_CANCEL:
      case hwcrypto.NO_IMPLEMENTATION:
        return errorKeyPrefix + err.message.toUpperCase();
        break;
      case hwcrypto.INVALID_ARGUMENT:
      case hwcrypto.NOT_ALLOWED:
      case hwcrypto.TECHNICAL_ERROR:
        console.error(err.message, 'Technical error from HWCrypto library', err);
        return errorKeyPrefix + 'TECHNICAL_ERROR';
        break;
      default:
        console.error(err.message, 'Unknown error from HWCrypto library', err);
        return errorKeyPrefix + 'TECHNICAL_ERROR';
    }
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
            if (voteResponse.signedInfoDiges && voteResponse.token && voteResponse.signedInfoHashType) {
              const signature = await hwcrypto.sign(certificate, { hex: voteResponse.signedInfoDigest, type: voteResponse.signedInfoHashType }, {});
              const signTopicVote = {
                id: this.topic.voteId,
                topicId: this.topic.id,
                signatureValue: signature.hex,
                token: voteResponse.token
              };

              this.TopicVoteService.sign(signTopicVote).pipe(take(1)).subscribe(
                (signed) => {
                  console.log(signed);
                  this.isLoadingIdCard = false;
                  this.dialog.closeAll();
                  this.Notification.addSuccess('VIEWS.TOPICS_TOPICID.MSG_VOTE_REGISTERED');
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
          msg = this.hwCryptoErrorToTranslationKey(err);
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
