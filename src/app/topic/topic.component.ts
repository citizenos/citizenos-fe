import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { AuthService } from 'src/app/services/auth.service';
import { UploadService } from 'src/app/services/upload.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of, map, tap, Observable } from 'rxjs';
import { TopicService } from 'src/app/services/topic.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { AppService } from 'src/app/services/app.service';
import { Topic } from 'src/app/interfaces/topic';
import { Attachment } from 'src/app/interfaces/attachment';
import { DomSanitizer } from '@angular/platform-browser';
import { Vote } from '../interfaces/vote';

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  topic$; // decorate the property with @Input()
  vote$?: Observable<Vote>;
  topicId$: Observable<string> = of('');
  editMode = false;
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

  constructor(
    private Auth: AuthService,
    public TopicService: TopicService,
    private router: Router,
    private route: ActivatedRoute,
    private Upload: UploadService,
    public TopicAttachmentService: TopicAttachmentService,
    public TopicArgumentService: TopicArgumentService,
    private TopicVoteService: TopicVoteService,
    private sanitizer: DomSanitizer,
    public app: AppService
  ) {
    if (this.router.url.indexOf('votes/create') > -1) {
      this.showVoteCreateForm = true;
    }

    if (this.router.url.indexOf('followup') > -1) {
      this.viewFollowup = true;
    }

    if (this.router.url.indexOf('votes/') > -1 && !this.showVoteCreateForm) {
      this.showVoteCast = true;
    }

    this.editMode$ = this.route.queryParams.pipe(
      map((params: any) => {
        this.editMode = !!params.editMode;
        return !!params.editMode
      })
    )
    this.topicId$ = this.route.params.pipe(
      switchMap((params) => {
        return of(params['topicId']);
      })
    );
    this.topic$ = this.topicId$.pipe(
      switchMap((topicId: string) => {
        return this.TopicService.get(topicId);
      }),
      tap((topic) => {
        if (topic.voteId) {
          this.vote$ = this.TopicVoteService.get({topicId: topic.id, voteId: topic.voteId});
        }
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

  sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
  }

  hideInfoEdit() {
    this.showInfoEdit = false;
  };

  togglePin(topic: Topic) {
    this.TopicService.togglePin(topic);
  }

  doShowReportOverlay() {
    /*this.ngDialog.openConfirm({
      template: '/views/modals/topic_reports_reportId.html',
      data: this.$stateParams,
      scope: this,
      closeByEscape: false
    }).then(() => {
      this.hideTopicContent = false;
    }, () => {
      this.$state.go('home');
    }
    );*/
  };

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  downloadAttachment(topicId: string, attachment: Attachment) {
    return this.Upload.download(topicId, attachment.id, this.Auth.user.value.id || '');
  };
}
