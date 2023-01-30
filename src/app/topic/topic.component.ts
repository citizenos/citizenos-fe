import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { AuthService } from 'src/app/services/auth.service';
import { UploadService } from 'src/app/services/upload.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { TopicService } from 'src/app/services/topic.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { AppService } from 'src/app/services/app.service';
import { Topic } from 'src/app/interfaces/topic';
import { Attachment } from 'src/app/interfaces/attachment';

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  topic$; // decorate the property with @Input()
  editMode = false;
  showInfoEdit = false;
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
    private route: ActivatedRoute,
    private Upload: UploadService,
    public TopicAttachmentService: TopicAttachmentService,
    public TopicArgumentService: TopicArgumentService,
    public app: AppService
  ) {
    this.topic$ = this.route.params.pipe<Topic>(
      switchMap((params) => {
        return this.TopicService.get(params['topicId']);
      })
    );

    this.topicAttachments$ = this.route.params.pipe(
      switchMap((params) => {
        this.TopicAttachmentService.setParam('topicId', params['topicId']);
        return this.TopicAttachmentService.loadItems();
      })
    );
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
