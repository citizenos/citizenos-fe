import { Observable, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UploadService } from 'src/app/services/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { TopicService } from 'src/app/services/topic.service';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'topic-sidepanel',
  templateUrl: './topic-sidepanel.component.html',
  styleUrls: ['./topic-sidepanel.component.scss']
})
export class TopicSidepanelComponent implements OnInit {
  @Input() topic!: Topic;
  editMode = false;
  wWidth = window.innerWidth;
  STATUSES = this.TopicService.STATUSES;
  VISIBILITY = this.TopicService.VISIBILITY;
  ATTACHMENT_SOURCES = this.TopicAttachmentService.SOURCES;
  attachments$: Observable<any[]>;
  config = this.app.config.get('attachments');
  constructor(
    private TopicAttachmentService: TopicAttachmentService,
    public AuthService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private TopicService: TopicService,
    public app: AppService,
    private Upload: UploadService
  ) {
    this.attachments$ = this.TopicAttachmentService.loadItems();
  }

  ngOnInit(): void {
    const attachmentParams = this.TopicAttachmentService.params$.value;
    console.log(this.config)
    attachmentParams.topicId = this.topic.id;
    this.TopicAttachmentService.params$.next(attachmentParams);
  }

  doToggleEditMode() {
    const params = this.router.parseUrl(this.router.url).queryParams;
    if (params['editMode']) {
      delete params['editMode'];
    } else {
      params['editMode'] = true;
    }

    this.router.navigate([], {queryParams: params});
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
    const duplicateDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        heading: 'MODALS.DUPLICATE_TOPIC_CONFIRM_HEADING',
        description: 'MODALS.DUPLICATE_TOPIC_CONFIRM_HEADING_DESCRIPTION',
        title: 'MODALS.DUPLICATE_TOPIC_CONFIRM_HEADING',
        sections: [{
          heading: 'MODALS.DUPLICATE_TOPIC_CONFIRM_HEADING_WILL_BE_DUPLICATED',
          points: [
            'MODALS.DUPLICATE_TOPIC_CONFIRM_TXT_COPY_TOPIC_CONTENT',
            'MODALS.DUPLICATE_TOPIC_CONFIRM_TXT_COPY_ATTACHMENTS',
          ]
        }, {
          heading: 'MODALS.DUPLICATE_TOPIC_CONFIRM_HEADING_WILL_NOT_BE_DUPLICATED',
          points: [
            'MODALS.DUPLICATE_TOPIC_CONFIRM_TXT_SETTINGS',
            'MODALS.DUPLICATE_TOPIC_CONFIRM_TXT_PERMISSIONS',
            'MODALS.DUPLICATE_TOPIC_CONFIRM_TXT_HISTORY',
            'MODALS.DUPLICATE_TOPIC_CONFIRM_TXT_DISCUSSIONS',
            'MODALS.DUPLICATE_TOPIC_CONFIRM_TXT_RELATED_INFO',
            'MODALS.DUPLICATE_TOPIC_CONFIRM_TXT_VOTES',
            'MODALS.DUPLICATE_TOPIC_CONFIRM_TXT_FOLLOW_UP_POSTS'
          ]
        }],
        confirmBtn: 'MODALS.DUPLICATE_TOPIC_CONFIRM__BTN_YES',
        closeBtn: 'MODALS.DUPLICATE_TOPIC_CONFIRM_BTN_NO'
      }
    });

    duplicateDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.TopicService
          .duplicate(this.topic)
          .pipe(take(1))
          .subscribe((duplicate) => {
            this.router.navigate(['/topics', duplicate.id]);
          });
      }
    })
    /*this.dialog
      .openConfirm({
        template: '/views/modals/topic_duplicate_confirm.html',
      })
      .then(() => {

      }, angular.noop);*/
  };

  openFeedback() {
    /*  const dialog = this.dialog
        .open(FeedbackComponent);*/
  };
}
