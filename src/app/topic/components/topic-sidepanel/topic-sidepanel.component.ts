import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UploadService } from 'src/app/services/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { TopicService } from 'src/app/services/topic.service';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-topic-sidepanel',
  templateUrl: './topic-sidepanel.component.html',
  styleUrls: ['./topic-sidepanel.component.scss']
})
export class TopicSidepanelComponent implements OnInit {
  @Input() topic!: Topic;
  editMode = false;
  wWidth = window.innerWidth;
  STATUSES = this.TopicService.STATUSES;
  VISIBILITY = this.TopicService.VISIBILITY;
  attachments$: Observable<any[]>;
  constructor(
    private TopicAttachmentService: TopicAttachmentService,
    public AuthService: AuthService,
    private dialog: MatDialog,
    private Translate: TranslateService,
    private TopicService: TopicService,
    public app: AppService,
    private Upload: UploadService
  ) {
    this.attachments$ = this.TopicAttachmentService.loadItems(this.topic);
  }

  ngOnInit(): void {
  }

  doToggleEditMode() {

  }

  sendToVote() {
    return this.TopicService.changeState(this.topic, 'vote');
  };

  canLeave() {
    return this.TopicService.canLeave();
  }

  canSendToVote() {
    return this.TopicService.canSendToVote(this.topic);
  }

  canSendToFollowUp() {
    return this.TopicService.canSendToFollowUp(this.topic);
  }

  sendToFollowUp(stateSuccess?: string) {
    this.app.topicsSettings = false;
    return this.TopicService.changeState(this.topic, 'followUp', stateSuccess);
  };

  closeTopic() {
    this.app.topicsSettings = false;
    return this.TopicService.changeState(this.topic, 'closed');
  };

  downloadAttachment(attachment: any) {
    this.app.topicsSettings = false;
    return this.Upload.download(this.topic.id, attachment.id, this.AuthService.user.value.id || '');
  };

  canEditDescription() {
    return this.TopicService.canEditDescription(this.topic);
  }

  canEdit() {
    return this.TopicService.canEdit(this.topic);
  }

  canUpdate() {
    return this.TopicService.canUpdate(this.topic);
  }

  canDelete() {
    return this.TopicService.canDelete(this.topic);
  }

  duplicateTopic() {
    /*this.dialog
      .openConfirm({
        template: '/views/modals/topic_duplicate_confirm.html',
      })
      .then(() => {
        this.TopicService
          .duplicate(this.topic)
          .pipe(take(1))
          .subscribe((duplicate) => {
            this.router.navigate([this.Translate.,'topics', duplicate.id])
            this.$state.go('topics/view', { topicId: duplicate.id }, { reload: true });
          });
      }, angular.noop);*/
  };

  openFeedback() {
    /*  const dialog = this.dialog
        .open(FeedbackComponent);*/
  };
}
