import { TopicEventService } from './../services/topic-event.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of, map, tap, Observable, take } from 'rxjs';
import { DialogService } from 'src/app/shared/dialog';
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
import { TopicAddGroupsDialogComponent } from './components/topic-add-groups/topic-add-groups.component';
import { TopicJoinComponent } from './components/topic-join/topic-join.component';
import { TopicReportReasonComponent } from './components/topic-report-reason/topic-report-reason.component';
import { TopicJoinService } from 'src/app/services/topic-join.service';
import { TourService } from 'src/app/services/tour.service';
import { InviteEditorsComponent } from './components/invite-editors/invite-editors.component';
import { TopicOnboardingComponent } from './components/topic-onboarding/topic-onboarding.component';

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
        bottom: '-200px'
      })),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('1s')
      ]),
    ])
  ]
})

export class TopicComponent implements OnInit {
  //new
  readMoreButton = false;
  skipTour = false;
  voteEl?: ElementRef;
  @ViewChild('topicVote') set setVoteEl(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
      this.voteEl = content;
      this.cd.detectChanges();
    }
  }
  followUpEl?: ElementRef;
  @ViewChild('topicFollowUp') set setFollowUpEl(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
      this.followUpEl = content;
      this.cd.detectChanges();
    }
  }

  topicText?: ElementRef;
  @ViewChild('topicText') set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
      this.topicText = content;
      if (content.nativeElement.offsetHeight >= 320) {
        this.readMoreButton = true;
      }
      this.cd.detectChanges();
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
  members$: Observable<any[]>;

  topicSocialMentions = [];
  activeCommentSection = 'arguments';
  wWidth: number = window.innerWidth;
  topicSettings = false;
  topicAttachments$ = of(<Attachment[] | any[]>[]);
  STATUSES = this.TopicService.STATUSES;
  hideTopicContent = false;
  hideDiscussion = false;
  constructor(
    @Inject(TranslateService) public translate: TranslateService,
    @Inject(DialogService) private DialogService: DialogService,
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
    private cd: ChangeDetectorRef,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer,
    public app: AppService
  ) {
    this.app.darkNav = true;

    this.tabSelected$ = this.route.fragment.pipe(
      map((value) => {
        if (this.hideDiscussion === true && value === 'discussion') {
          value = 'voting';
        }
        this.app.setPageTitle(this.topicTitle || 'META_DEFAULT_TITLE');
        setTimeout(() => {
          if (value === 'voting') {
            this.scroll(this.voteEl?.nativeElement);
          }
          if (value === 'followUp') {
            this.scroll(this.followUpEl?.nativeElement);
          }
        }, 200);
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
          this.DialogService.closeAll();
          this.hideTopicContent = true;
        }
        if (topic.voteId) {
          this.vote$ = this.TopicVoteService.get({ topicId: topic.id, voteId: topic.voteId });
          this.cd.detectChanges();
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
        if (!sessionStorage.getItem('showTutorial')) {
          setTimeout(() => {
            if (window.innerWidth <560) {
              this.showTutorial = false;
            } else {
              this.showTutorial = true;
            }
          }, 500);
        }
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

    this.members$ = this.route.params.pipe(
      switchMap((params) => {
        this.TopicMemberUserService.setParam('topicId', params['topicId']);
        return this.TopicMemberUserService.loadItems();
      })
    );
    this.topicAttachments$ = this.topicId$.pipe(
      switchMap((topicId: string) => {
        this.TopicAttachmentService.setParam('topicId', topicId);
        return this.TopicAttachmentService.loadItems();
      })
    );

    this.topic$.pipe(
      switchMap((topic: Topic) => {
        this.TopicArgumentService.setParam('topicId', topic.id);
        return this.TopicArgumentService.loadItems().pipe(
          tap((args) => {
            if(!args.length && topic.status !== this.TopicService.STATUSES.inProgress) {
              this.hideDiscussion = true;
              if (!this.route.snapshot.fragment || this.route.snapshot.fragment === 'discussion') {
                this.router.navigate([], {fragment: 'voting'});
              }
            }
          })
        );
      }),
      take(1)
    ).subscribe();
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (window.innerWidth <= 1024) {
      this.skipTour = true;
      setTimeout(() => {
        this.DialogService.closeAll();
        const onBoarding = this.DialogService.open(TopicOnboardingComponent);
        this.app.mobileTutorial = true;
        onBoarding.afterClosed().subscribe((skip) => {
          if (skip) {
            this.showTutorial = false;
            this.skipTour = false;
          }
          this.app.mobileTutorial = false
        });
      });
    } else {
      setTimeout(() => {
        sessionStorage.setItem('showTutorial', 'true');
        this.showTutorial = false;
      }, 5000);
    }
  }

  reportReasonDialog(topic: Topic) {
    this.DialogService.open(TopicReportReasonComponent, {
      data: {
        report: topic.report
      }
    })
  }

  dialogsOpen() {
    return this.DialogService.openDialogs.length;
  }

  deleteTopic(topic: Topic) {
    this.TopicService.doDeleteTopic(topic, ['my', 'topics']);
  }
  joinTopic(topic: Topic) {
    const joinDialog = this.DialogService.open(TopicJoinComponent, {
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
    const leaveDialog = this.DialogService.open(ConfirmDialogComponent, {
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

  currentUrl() {
    return this.Location.currentUrl();
  }

  toggleFavourite(topic: Topic) {
    this.TopicService.toggleFavourite(topic);
  }

  takeTour() {
    this.showTutorial = false;
    window.scrollTo(0, 0);
    let tourName = 'topic';
    if (window.innerWidth <= 1024) {
      tourName = 'topic_mobile';
    }
    this.TourService.show(tourName, 1);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }

  downloadAttachment(topicId: string, attachment: Attachment) {
    if (attachment.source === this.TopicAttachmentService.SOURCES.upload) {
      return this.Upload.download(topicId, attachment.id, this.auth.user.value.id || '');
    }
    return window.open(attachment.link, '_blank');
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

  addGroupsDialog(topic: Topic) {
    this.DialogService.open(TopicAddGroupsDialogComponent, {
      data: {
        topic: topic
      }
    });
  }

  inviteEditors(topic: Topic) {
    const inviteDialog = this.DialogService.open(InviteEditorsComponent, { data: { topic: topic } });
    inviteDialog.afterClosed().subscribe({
      next: (inviteUsers) => {
     //   this.loadInvite$.next();
      },
      error: (error) => {
        this.NotificationService.addError(error);
      }
    })
  }

  inviteMembers(topic: Topic) {
    const inviteDialog = this.DialogService.open(TopicInviteDialogComponent, { data: { topic } });
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
    const participantsDialog = this.DialogService.open(TopicParticipantsComponent, { data: { topic } });
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
    const duplicateDialog = this.DialogService.open(DuplicateTopicDialogComponent, {
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
    this.DialogService.open(TopicVoteCreateDialogComponent, {
      data: {
        topic: topic
      }
    })
  }

  canSendToFollowUp(topic: Topic) {
    return this.TopicService.canSendToFollowUp(topic);
  }

  sendToFollowUp(topic: Topic, stateSuccess?: string) {
    this.DialogService.open(TopicFollowUpCreateDialogComponent, {
      data: {
        topic: topic
      }
    })
  };
}
