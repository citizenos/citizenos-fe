import { TopicEventService } from './../services/topic-event.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of, map, tap, Observable, take } from 'rxjs';
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
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { TopicMemberUserService } from '../services/topic-member-user.service';
import { TopicInviteDialogComponent } from './components/topic-invite/topic-invite.component';
import { TopicParticipantsComponent } from './components/topic-participants/topic-participants.component';
import { DuplicateTopicDialogComponent } from './components/duplicate-topic-dialog/duplicate-topic-dialog.component';
import { TopicVoteCreateDialogComponent } from './components/topic-vote-create/topic-vote-create.component';
import { TopicFollowUpCreateDialogComponent } from './components/topic-follow-up-create-dialog/topic-follow-up-create-dialog.component';
import { TopicTourDialogComponent } from './components/topic-tour-dialog/topic-tour-dialog.component'
import { TopicJoinComponent } from './components/topic-join/topic-join.component';
import { TopicReportReasonComponent } from './components/topic-report-reason/topic-report-reason.component';
import { TopicJoinService } from 'src/app/services/topic-join.service';
import { TourService } from 'src/app/services/tour.service';

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  animations: [
    trigger('readMore', [
      state('open', style({
        maxHeight: '100%',
        transition: '0.1s max-height'
      })),
      state('closed', style({
        maxHeight: '320px',
        transition: '0.1s max-height'
      }))
    ]),
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
    trigger('showTutorial', [
      state('open', style({
        bottom: 0,
      })),
      state('closed', style({
        bottom: '-325px'
      })),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('1s')
      ]),
    ]),
  ]
})

export class TopicComponent implements OnInit {
  //new
  topicText?: ElementRef
  readMoreButton = false;
  @ViewChild('topicText') set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
      this.topicText = content;
      if (content.nativeElement.offsetHeight > 200) {
        this.readMoreButton = true;
      }
    }
  }
  showCategories = false;
  showAttachments = false;
  showGroups = false;
  showTags = false;
  readMore = false;
  tabTablet = '';
  showArgumentsTablet = (window.innerWidth <= 1024);
  showVoteTablet = (window.innerWidth <= 1024);
  showFollowUpTablet = (window.innerWidth <= 1024);
  tabSelected$: Observable<string>;
  showTutorial = false;
  topicTitle: string = '';
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
    private TopicJoinService: TopicJoinService,
    public TopicArgumentService: TopicArgumentService,
    private TopicVoteService: TopicVoteService,
    public TopicEventService: TopicEventService,
    private TourService: TourService,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer,
    public app: AppService
  ) {
    this.app.darkNav = true;

    this.tabSelected$ = this.route.fragment.pipe(
      map((value) => {
        this.app.setPageTitle(this.topicTitle || 'META_DEFAULT_TITLE');
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
        this.app.setPageTitle(topic.title || 'META_DEFAULT_TITLE');
        topic.description = topic.description.replace(/href="/gi, 'target="_blank" href="');
        this.app.topic = topic;
        this.topicTitle = topic.title || '';
        if (topic.report && topic.report.moderatedReasonType) {
          // NOTE: Well.. all views that are under the topics/view/votes/view would trigger doble overlays which we don't want
          // Not nice, but I guess the problem starts with the 2 views using same controller. Ideally they should have a parent controller and extend that with their specific functionality
          this.dialog.closeAll();
          this.hideTopicContent = true;
        }
        if (topic.voteId) {
          this.vote$ = this.TopicVoteService.get({ topicId: topic.id, voteId: topic.voteId });
        }
        if (topic.status === this.TopicService.STATUSES.followUp) {
          this.events$ = TopicEventService.getItems({ topicId: topic.id });
        }
        const padURL = new URL(topic.padUrl);
        if (padURL.searchParams.get('lang') !== this.translate.currentLang) {
          padURL.searchParams.set('lang', this.translate.currentLang);
        }
        padURL.searchParams.set('theme', 'default');
        topic.padUrl = padURL.href; // Change of PAD URL here has to be before $sce.trustAsResourceUrl($scope.topic.padUrl);
        setTimeout(() => {
          if (window.innerWidth <560) {
            this.showTutorial = false;
          /*  const tourDialog = this.dialog.open(TopicTourDialogComponent);
            tourDialog.afterClosed().subscribe((res) => {
              if (res) {
                this.takeTour();
              }
            });*/
          } else {
            this.showTutorial = true;
          }
        }, 500);
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

  reportReasonDialog(topic: Topic) {
    this.dialog.open(TopicReportReasonComponent, {
      data: {
        report: topic.report
      }
    })
  }

  joinTopic(topic: Topic) {
    const joinDialog = this.dialog.open(TopicJoinComponent, {
      data: {
        topic: topic
      }
    })/*.openConfirm({
        template: '/views/modals/group_join_confirm.html',
        closeByEscape: false
    })*/
    joinDialog.afterClosed().subscribe((res) => {
      if (res === true) {
        this.TopicJoinService
          .join(topic.join.token).pipe(take(1)).subscribe(
            {
              next: (res) => {
                topic.permission.level = res.userLevel;
              },
              error: (err) => {
                console.error('Failed to join Topic', err)
              }
            }
          )
      }

    });
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
    console.log('ngOnInit', this.topicText)
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit', this.topicText)
  }

  currentUrl() {
    return this.Location.currentUrl();
  }

  toggleFavourite(topic: Topic) {
    this.TopicService.toggleFavourite(topic);
  }

  takeTour() {
    window.scrollTo(0, 0);
    let tourName = 'tour';
    if (window.innerWidth <= 1024) {
      tourName = 'topic_mobile';
    }
    this.TourService.show(tourName, 1);
  }

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
