import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { TopicActivityService } from 'src/app/services/topic-activity.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { Observable, take, map, switchMap, BehaviorSubject, tap, of } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TopicNotificationSettingsComponent } from 'src/app/topic/components/topic-notification-settings/topic-notification-settings.component';
import { Vote } from 'src/app/interfaces/vote';
@Component({
  selector: 'my-topic',
  templateUrl: './my-topic.component.html',
  styleUrls: ['./my-topic.component.scss']
})
export class MyTopicComponent implements OnInit {
  @ViewChild('userListEl') userListEl?: ElementRef;
  @ViewChild('groupListEl') groupListEl?: ElementRef;

  topic$: Observable<Topic>;
  vote$?: Observable<Vote>;
  activities$ = of(<any[]>[])
  allActivities$ = <any[]>[];
  memberGroups$ = of(<any[]>[]);
  memberUsers$ = of(<any[]>[]);
  memberInvites$ = of(<any[]>[]);

  groupLevels = Object.keys(this.TopicService.LEVELS);
  //Sections
  generalInfo = true;
  activityFeed = false;
  voteResults = false;
  groupList = false;
  groupListSearch = false;
  userList = false;
  userListSearch = false;
  //Sections end
  activities = false;
  wWidth = window.innerWidth;
  constructor(
    public app: AppService,
    private AuthService: AuthService,
    public TopicService: TopicService,
    private TopicVoteService: TopicVoteService,
    private Translate: TranslateService,
    public dialog: MatDialog,
    public TopicMemberUserService: TopicMemberUserService,
    public TopicMemberGroupService: TopicMemberGroupService,
    public TopicInviteUserService: TopicInviteUserService,
    private route: ActivatedRoute,
    private router: Router,
    public TopicActivityService: TopicActivityService
  ) {

    this.topic$ = this.route.params.pipe(
      switchMap((params) => {
        return this.TopicService.get(params['topicId']);
      }),
      tap((topic) => {
        if (topic.voteId) {
          this.vote$ = this.TopicVoteService.get({ topicId: topic.id, voteId: topic.voteId });
        }
      })
    );
    this.memberGroups$ = this.route.params.pipe(
      switchMap((params) => {
        this.TopicMemberGroupService.params.topicId = params['topicId'];
        this.TopicMemberGroupService.setParam('topicId', params['topicId']);
        return this.TopicMemberGroupService.loadItems()
      }));

    this.memberUsers$ = this.route.params.pipe(
      switchMap((params) => {
        this.TopicMemberUserService.params.topicId = params['topicId'];
        this.TopicMemberUserService.setParam('topicId', params['topicId']);
        return this.TopicMemberUserService.loadItems()
      }));

    this.memberInvites$ = this.route.params.pipe(
      switchMap((params) => {
        this.TopicInviteUserService.params.topicId = params['topicId'];
        this.TopicInviteUserService.setParam('topicId', params['topicId']);
        return this.TopicInviteUserService.loadItems()
      }));

    this.activities$ = this.route.params.pipe(
      switchMap((params) => {
        this.TopicActivityService.setParam('topicId', params['topicId']);
        return this.TopicActivityService.loadItems()
      }),
      map(
        (newActivities: any) => {
          this.allActivities$ = this.allActivities$.concat(newActivities);
          return this.allActivities$;
        }
      ));
  }

  ngOnInit(): void {
  }

  goToTopicView(topic: Topic) {
    if (!topic) return;
    const language = this.Translate.currentLang;
    const status = topic.status;
    if (status === this.TopicService.STATUSES.inProgress) {
      this.router.navigate([language, 'topics', topic.id]);
    } else if (status === this.TopicService.STATUSES.voting) {
      this.router.navigate([language, 'topics', topic.id, 'votes', topic.voteId]);
    } else {
      this.router.navigate([language, 'topics', topic.id, 'followup']);
    }
  };

  doLeaveTopic(topic: Topic) {
    this.TopicMemberUserService.doLeaveTopic(topic, [this.Translate.currentLang, 'my', 'topics']);
  };

  doDeleteTopic(topic: Topic) {
    this.TopicService.doDeleteTopic(topic, [this.Translate.currentLang, 'my', 'topics']);
  };

  doToggleActivities() {
    this.TopicActivityService.reset();
    this.activityFeed = !this.activityFeed;
  };

  doToggleVoteResults() {
    this.voteResults = !this.voteResults;
  };

  doToggleMemberGroupList() {
    this.TopicMemberGroupService.reset();
    this.groupList = !this.groupList;
  };

  doToggleMemberUserList() {
    this.TopicMemberUserService.reset();;
    this.userList = !this.userList;
  };

  loadMoreActivities(event: any) {
    if ((event.target.scrollTop + event.target.offsetHeight) >= event.target.scrollHeight) {
      this.TopicActivityService.loadMore()
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  viewMemberUsers() {
    this.userList = true;
    this.scroll(this.userListEl?.nativeElement);
  }

  viewMemberGroups() {
    this.groupList = true;
    this.scroll(this.groupListEl?.nativeElement);
  }

}
