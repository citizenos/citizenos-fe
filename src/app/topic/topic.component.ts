import { TopicEventService } from './../services/topic-event.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of, map, tap, Observable, Subscription, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { UploadService } from 'src/app/services/upload.service';
import { TopicService } from 'src/app/services/topic.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { AppService } from 'src/app/services/app.service';
import { Topic } from 'src/app/interfaces/topic';
import { Attachment } from 'src/app/interfaces/attachment';
import { Vote } from '../interfaces/vote';
import { Group } from '../interfaces/group';
import { TopicReportComponent } from './components/topic-report/topic-report.component';
import { trigger, state, style } from '@angular/animations';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { TopicMemberUserService } from '../services/topic-member-user.service';
import { TopicInviteDialogComponent } from './components/topic-invite/topic-invite.component';
import { TopicParticipantsComponent } from './components/topic-participants/topic-participants.component';
import { DuplicateTopicDialogComponent } from './components/duplicate-topic-dialog/duplicate-topic-dialog.component';
import { TopicVoteCreateDialogComponent } from './components/topic-vote-create/topic-vote-create.component';
import { TopicFollowUpCreateDialogComponent } from './components/topic-follow-up-create-dialog/topic-follow-up-create-dialog.component';

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        minHeight: '100%',
        maxHeight: '100%',
        transition: '0.3s ease-in-out max-height'
      })),
      state('closed', style({
        overflowY: 'hidden',
        transition: '0.3s ease-in-out max-height'
      }))
    ]),
  ]
})

export class TopicComponent implements OnInit {
  //new
  showCategories = false;
  showAttachments = false;
  showGroups = false;
  showTags = false;
  readMore = false;
  showArgumentsTablet = (window.innerWidth <= 1024);
  showVoteTablet = (window.innerWidth <= 1024);
  tabSelected$: Observable<string>;
  //new end
  topic$; // decorate the property with @Input()
  groups$: Observable<Group[]>;
  vote$?: Observable<Vote>;
  topicId$: Observable<string> = of('');
  events$?: Observable<any>;

  topicSocialMentions = [];
  activeCommentSection = 'arguments';
  wWidth: number = window.innerWidth;
  topicSettings = false;
  topicAttachments$ = of(<Attachment[] | any[]>[]);
  STATUSES = this.TopicService.STATUSES;
  hideTopicContent = false;

  constructor(
    @Inject(TranslateService) public translate: TranslateService,
    @Inject(MatDialog) private dialog: MatDialog,
    public auth: AuthService,
    public TopicService: TopicService,
    @Inject(Router) private router: Router,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private Upload: UploadService,
    private Location: LocationService,
    private NotificationService: NotificationService,
    private TopicMemberUserService: TopicMemberUserService,
    private TopicMemberGroupService: TopicMemberGroupService,
    public TopicAttachmentService: TopicAttachmentService,
    public TopicArgumentService: TopicArgumentService,
    private TopicVoteService: TopicVoteService,
    public TopicEventService: TopicEventService,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer,
    public app: AppService
  ) {
    this.app.darkNav = true;

    this.tabSelected$ = this.route.fragment.pipe(
      map((value) => {
        return value || 'discussion';
      })
    );

    this.topicId$ = this.route.params.pipe(
      switchMap((params) => {
        return of(params['topicId']);
      })
    );
    this.topic$ = this.route.params.pipe(
      switchMap((params) => {
        return this.TopicService.loadTopic(params['topicId']);
      }),
      tap((topic: Topic) => {
        topic.description = topic.description.replace(/href="/gi, 'target="_blank" href="');
        this.app.topic = topic;
        if (topic.report && topic.report.moderatedReasonType) {
          // NOTE: Well.. all views that are under the topics/view/votes/view would trigger doble overlays which we don't want
          // Not nice, but I guess the problem starts with the 2 views using same controller. Ideally they should have a parent controller and extend that with their specific functionality
          this.dialog.closeAll();
          this.hideTopicContent = true;
          this.doShowReportOverlay(topic);
        }
        if (topic.voteId) {
          this.vote$ = this.TopicVoteService.get({ topicId: topic.id, voteId: topic.voteId });
        }
        if (topic.status === this.TopicService.STATUSES.followUp) {
          this.events$ = TopicEventService.getItems({topicId: topic.id});
        }
        const padURL = new URL(topic.padUrl);
        if (padURL.searchParams.get('lang') !== this.translate.currentLang) {
          padURL.searchParams.set('lang', this.translate.currentLang);
        }
        padURL.searchParams.set('theme', 'default');
        topic.padUrl = padURL.href; // Change of PAD URL here has to be before $sce.trustAsResourceUrl($scope.topic.padUrl);
        return topic;
      })
    );
    //needs API implementation
    this.groups$ = this.route.params.pipe(
      switchMap((params) => {
        this.TopicMemberGroupService.setParam('topicId', params['topicId']);
        return this.TopicMemberGroupService.loadItems();
      })
    );

    this.topicAttachments$ = this.topicId$.pipe(
      switchMap((topicId: string) => {
        this.TopicAttachmentService.setParam('topicId', topicId);
        return this.TopicAttachmentService.loadItems();
      })
    );
  }

  ngOnDestroy(): void {
  }

  leaveTopic(topic: Topic) {
    const leaveDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_HEADING',
        description: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_TXT_ARE_YOU_SURE',
        points: ['MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_TXT_LEAVING_TOPIC_DESC'],
        confirmBtn: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_BTN_NO'
      }
    });
    leaveDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.TopicMemberUserService
          .delete({ id: this.auth.user.value.id, topicId: topic.id })
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate([this.translate.currentLang, 'my', 'topics']);
          });
      }
    });
  };

  getArgumentPercentage(count: number) {
    return count / (this.TopicArgumentService.count.value.pro + this.TopicArgumentService.count.value.con) * 100 || 0;
  }

  sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
  }

  currentUrl() {
    return this.Location.currentUrl();
  }

  togglePin(topic: Topic) {
    this.TopicService.togglePin(topic);
  }

  doShowReportOverlay(topic: Topic) {
    const reportDialog = this.dialog.open(TopicReportComponent, {
      data: {
        topic: topic
      }
    })

    reportDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        return this.hideTopicContent = false;
      }

      return this.router.navigate(['/']);
    })
  };

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  downloadAttachment(topicId: string, attachment: Attachment) {
    return this.Upload.download(topicId, attachment.id, this.auth.user.value.id || '');
  };

  hasVoteEndedExpired(topic: Topic, vote: Vote) {
    return [this.STATUSES.followUp, this.STATUSES.closed].indexOf(topic.status) < 0 && vote && vote.endsAt && new Date() > new Date(vote.endsAt);
  };

  hasVoteEnded(topic: Topic, vote: Vote) {
    if ([this.STATUSES.followUp, this.STATUSES.closed].indexOf(topic.status) > -1) {
      return true;
    }

    return vote && vote.endsAt && new Date() > new Date(vote.endsAt);
  };

  inviteMembers(topic: Topic) {
    const inviteDialog = this.dialog.open(TopicInviteDialogComponent, { data: { topic } });
    inviteDialog.afterClosed().subscribe({
      next: (res) => {
        //   this.NotificationService.addSuccess('');
      },
      error: (error) => {
        this.NotificationService.addError(error);
      }
    })
  }

  manageParticipants(topic: Topic) {
    const participantsDialog = this.dialog.open(TopicParticipantsComponent, { data: { topic } });
    participantsDialog.afterClosed().subscribe({
      next: (res) => {
        //   this.NotificationService.addSuccess('');
      },
      error: (error) => {
        this.NotificationService.addError(error);
      }
    })
  }

  canUpdate(topic: Topic) {
    return this.TopicService.canUpdate(topic);
  }

  duplicateTopic(topic: Topic) {
    const duplicateDialog = this.dialog.open(DuplicateTopicDialogComponent, {
      data: {
        topic: topic
      }
    });

    duplicateDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.TopicService
          .duplicate(topic)
          .pipe(take(1))
          .subscribe((duplicate) => {
            this.router.navigate(['/topics', duplicate.id]);
          });
      }
    })
  };

  startVote(topic: Topic) {
    this.dialog.open(TopicVoteCreateDialogComponent, {
      data: {
        topic: topic
      }
    })
  }

  canSendToFollowUp(topic: Topic) {
    return this.TopicService.canSendToFollowUp(topic);
  }

  sendToFollowUp(topic: Topic, stateSuccess?: string) {
    this.dialog.open(TopicFollowUpCreateDialogComponent, {
      data: {
        topic: topic
      }
    })
  };

}
