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
  //new end
  topic$; // decorate the property with @Input()
  // groups$: Observable<Group[]>;
  vote$?: Observable<Vote>;
  topicId$: Observable<string> = of('');
  editMode$;
  showInfoEdit = false;


  showVoteCreateForm = false;
  showVoteCast = false;
  viewFollowup = false;
  hideTopicContent = false;
  topicSocialMentions = [];
  activeCommentSection = 'arguments';
  wWidth: number = window.innerWidth;
  topicSettings = false;
  topicAttachments$ = of(<Attachment[] | any[]>[]);
  ATTACHMENT_SOURCES = this.TopicAttachmentService.SOURCES;
  STATUSES = this.TopicService.STATUSES;
  VOTE_TYPES = this.TopicVoteService.VOTE_TYPES;
  routerSubscription: Subscription;
  tabSelected = 'inProgress';

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
    @Inject(DomSanitizer) private sanitizer: DomSanitizer,
    public app: AppService
  ) {
    this.routerSubscription = this.route.url.pipe(
      tap((url) => {
        console.log('URL', url)
        this.showVoteCreateForm = false;
        this.showVoteCast = false;
        this.viewFollowup = false;
        if (this.router.url.indexOf('votes/create') > -1) {
          console.log('showVoteCreateForm')
          this.showVoteCreateForm = true;
        } else {
          this.showVoteCreateForm = false;
        }
        if (this.router.url.indexOf('followup') > -1) {
          this.viewFollowup = true;
        }
        if (this.router.url.indexOf('votes/') > -1 && !this.showVoteCreateForm) {
          this.showVoteCast = true;
        }
      })
    ).subscribe();


    this.editMode$ = this.route.queryParams.pipe(
      map((params: any) => {
        this.app.editMode = !!params.editMode;
        return !!params.editMode
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
          this.doShowReportOverlay(topic);
          this.hideTopicContent = true;
        }
        if (topic.voteId) {
          this.showVoteCreateForm = false;
          this.showVoteCast = true;
          this.vote$ = this.TopicVoteService.get({ topicId: topic.id, voteId: topic.voteId });
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
    //needs implementation
    /*   this.groups$ = this.route.params.pipe(
         switchMap((params) => {
           this.TopicMemberGroupService.setParam('topicId', params['topicId']);
           return this.TopicMemberGroupService.loadItems();
         })
       );*/

    this.topicAttachments$ = this.topicId$.pipe(
      switchMap((topicId: string) => {
        this.TopicAttachmentService.setParam('topicId', topicId);
        return this.TopicAttachmentService.loadItems();
      })
    );
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
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

  hideInfoEdit() {
    this.showInfoEdit = false;
  };

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
        this.NotificationService.addSuccess('');
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
        this.NotificationService.addSuccess('');
      },
      error: (error) => {
        this.NotificationService.addError(error);
      }
    })
  }
}
