import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of, map, tap, Observable, Subscription } from 'rxjs';
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
import { TopicReportComponent } from './components/topic-report/topic-report.component';

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  topic$; // decorate the property with @Input()
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
  more_info_button = false; //app.more_info_button not sure where used
  topicAttachments$ = of(<Attachment[] | any[]>[]);
  ATTACHMENT_SOURCES = this.TopicAttachmentService.SOURCES;
  STATUSES = this.TopicService.STATUSES;
  VOTE_TYPES = this.TopicVoteService.VOTE_TYPES;
  routerSubscription: Subscription;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private Auth: AuthService,
    public TopicService: TopicService,
    @Inject(Router) private router: Router,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private Upload: UploadService,
    private Location: LocationService,
    public TopicAttachmentService: TopicAttachmentService,
    public TopicArgumentService: TopicArgumentService,
    private TopicVoteService: TopicVoteService,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer,
    public app: AppService
  ) {
    this.routerSubscription = this.route.url.subscribe(url => {
      this.showVoteCreateForm = false;
      this.showVoteCast = false;
      this.viewFollowup = false;
      if (this.router.url.indexOf('votes/create') > -1) {
        this.showVoteCreateForm = true;
      }
      if (this.router.url.indexOf('followup') > -1) {
        this.viewFollowup = true;
      }
      if (this.router.url.indexOf('votes/') > -1 && !this.showVoteCreateForm) {
        this.showVoteCast = true;
      }
    });


    this.editMode$ = this.route.queryParams.pipe(
      map((params: any) => {
        this.app.editMode = !!params.editMode;
        this.TopicService.reloadTopic();
        return !!params.editMode
      })
    );
    this.topicId$ = this.route.params.pipe(
      switchMap((params) => {
        return of(params['topicId']);
      })
    );
    this.topic$ = this.topicId$.pipe(
      switchMap((topicId: string) => {
        return this.TopicService.loadTopic(topicId);
      }),
      tap((topic: Topic) => {
        this.app.topic = topic;
        if (topic.report && topic.report.moderatedReasonType) {
          // NOTE: Well.. all views that are under the topics/view/votes/view would trigger doble overlays which we don't want
          // Not nice, but I guess the problem starts with the 2 views using same controller. Ideally they should have a parent controller and extend that with their specific functionality
          this.dialog.closeAll();
          this.doShowReportOverlay(topic);
          this.hideTopicContent = true;
        }
        if (topic.voteId) {
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
    return this.Upload.download(topicId, attachment.id, this.Auth.user.value.id || '');
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
}
