import { Component, Inject } from '@angular/core';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { VoteDelegationService } from 'src/app/services/vote-delegation.service';
import { AuthService } from 'src/app/services/auth.service';
import { TopicService } from 'src/app/services/topic.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DIALOG_DATA } from 'src/app/shared/dialog';
import { debounceTime, distinctUntilChanged, of, take, switchMap } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { User } from 'src/app/interfaces/user';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-topic-vote-delegate',
  templateUrl: './topic-vote-delegate.component.html',
  styleUrls: ['./topic-vote-delegate.component.scss']
})
export class TopicVoteDelegateComponent {
  public topic!: Topic;
  public delegateUser?: User;
  searchResultUsers$ = of(<any>[]);
  public resultCount = 0;
  public searchStringUser = null;

  constructor(private Translate: TranslateService, @Inject(DIALOG_DATA) private data: any, private AuthService: AuthService, private TopicMemberUserService: TopicMemberUserService, private NotificationService: NotificationService, private VoteDelegation: VoteDelegationService, private TopicService: TopicService) {
    console.debug('TopicVoteDelegateController');
    this.topic = data.topic;
    this.searchResultUsers$ = of([]);
  }


  search(str: any): void {
    this.NotificationService.removeAll();
    if (str && str.length >= 2) {
      this.searchResultUsers$ = this.TopicMemberUserService
        .query({ topicId: this.topic.id, search: str })
        .pipe(debounceTime(200), distinctUntilChanged(), take(1),
          switchMap((response) => {
            const results = response.rows.filter((user: User) => {
              if (user.id !== this.AuthService.user.value.id) {
                return user;
              }
              return;
            });
            this.resultCount = results.length;
            return of(results);
          })
        );
    } else {
      this.searchResultUsers$ = of([]);
    }
  }

  addUser(member?: any) {
    this.NotificationService.removeAll();

    if (!member) {
      this.NotificationService.addError('MSG_ERROR_POST_API_USERS_TOPICS_VOTES_DELEGATIONS_40002');
    }

    if (member.id && member !== this.delegateUser) {
      this.delegateUser = member;
    }
    this.searchResultUsers$ = of([]);
  };

  doRemoveDelegateUser() {
    this.delegateUser = undefined;
  };

  doSaveDelegate() {
    if (this.delegateUser?.id) {
      this.VoteDelegation
        .save({ topicId: this.topic.id, voteId: this.topic.vote?.id, userId: this.delegateUser.id })
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.NotificationService.addSuccess(this.Translate.instant('MODALS.TOPIC_VOTE_DELEGATE_SUCCESS', {userName: this.delegateUser?.name}))
            this.TopicService.reloadTopic();
          }
        });
    }
  }
}
