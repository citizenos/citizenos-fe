import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take, takeWhile, switchMap } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { UploadService } from 'src/app/services/upload.service';
import { TopicService } from 'src/app/services/topic.service';
import { ActivatedRoute, Router } from '@angular/router';
export interface AttachmentData {
  topic: Topic
};

@Component({
  selector: 'app-topic-attachments',
  templateUrl: './topic-attachments.component.html',
  styleUrls: ['./topic-attachments.component.scss']
})
export class TopicAttachmentsComponent implements OnInit {
  @ViewChild('fileUpload') fileInput?: ElementRef;
  public topic!: Topic;
  public form = {
    files: <any[]>[],
    uploadfiles: <any[]>[]
  };
  private saveInProgress = false;
  config: any;
  constructor(
    private dialog: MatDialog,
    public app: AppService,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentData,
    public TopicService: TopicService,
    private TopicAttachmentService: TopicAttachmentService,
    private Notification: NotificationService,
    private Translate: TranslateService,
    private Upload: UploadService) {
    this.topic = data.topic;
    this.config = app.config.get('attachments');
  }

  ngOnInit(): void {
    this.TopicAttachmentService
      .query({ topicId: this.topic.id })
      .pipe(take(1)).subscribe((files: any) => {
        this.form.files = files.rows;
      });
  }

  attachmentUpload(): void {
    const files = this.fileInput?.nativeElement.files;
    for (let i = 0; i < files.length; i++) {
      const attachment = {
        name: files[i].name,
        type: files[i].name.split('.').pop(),
        source: 'upload',
        size: files[i].size,
        file: files[i]
      };

      if (attachment.size > 50000000) {
        this.Notification.addError('MSG_ERROR_ATTACHMENT_SIZE_OVER_LIMIT');
      } else if (this.Upload.ALLOWED_FILE_TYPES.indexOf(attachment.type.toLowerCase()) === -1) {
        const fileTypeError = this.Translate.instant('MSG_ERROR_ATTACHMENT_TYPE_NOT_ALLOWED', { allowedFileTypes: this.Upload.ALLOWED_FILE_TYPES.toString() });
        this.Notification.addError(fileTypeError);
      } else {
        this.doSaveAttachment(attachment);
      }
    }
  }

  triggerUpload() {
    this.fileInput?.nativeElement.click();
  };

  dropboxSelect() {
    this.TopicAttachmentService
      .dropboxSelect()
      .then((attachment) => {
        if (attachment) {
          this.doSaveAttachment(attachment);
        }
      });
  };

  oneDriveSelect() {
    this.TopicAttachmentService
      .oneDriveSelect()
      .then((attachment) => {
        if (attachment) {
          this.doSaveAttachment(attachment);
        }
      });
  };

  googleDriveSelect() {
    this.TopicAttachmentService
      .googleDriveSelect()
      .then((attachment) => {
        if (attachment) {
          this.doSaveAttachment(attachment);
        }
      });
  };

  appendAttachment(attachment: any) {
    this.doSaveAttachment(attachment);
  };

  doSaveAttachment(attachment: any) {
    attachment.topicId = this.topic.id;
    if (attachment.file) {
      this.Upload.topicAttachment(this.topic.id, attachment)
        .pipe(takeWhile((e) => !e.link, true))
        .subscribe({
          next: (result) => {
            if (result.link)
              this.form.files.push(result);
          },
          error: (res) => {
            if (res.errors) {
              const keys = Object.keys(res.errors);
              keys.forEach((key) => {
                this.Notification.addError(res.errors[key]);
              });
            } else if (res.status && res.status.message) {
              this.Notification.addError(res.status.message);
            } else {
              this.Notification.addError(res.message);
            }
          }
        });
    }
    else if (attachment.id) {
         this.TopicAttachmentService.update(attachment).pipe(take(1)).subscribe(() => {
          this.form.files.push(attachment);
         });
    } else {
         this.TopicAttachmentService.save(attachment).pipe(take(1)).subscribe({
          next: (result) => {
            if (result.id) {
              attachment = result
              this.form.files.push(attachment);
            }
          },
          error: (res) => {
            console.error(res);
          }
         });
    }
  };

  editAttachment(attachment: any, index: number) {
    attachment.editMode = !attachment.editMode;
    attachment.topicId = this.topic.id;
    if (!attachment.editMode && attachment.id) {
      this.TopicAttachmentService.update(attachment).pipe(take(1)).subscribe()
    }
  };

  deleteAttachment(key: number, attachment: any) {
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_ATTACHMENT_DELETE_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_ATTACHMENT_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.TOPIC_ATTACHMENT_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.TOPIC_ATTACHMENT_DELETE_CONFIRM_TXT_ATTACHMENT_DELETED'],
        confirmBtn: 'MODALS.TOPIC_ATTACHMENT_DELETE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.TOPIC_ATTACHMENT_DELETE_CONFIRM_BTN_NO'
      }
    })

    deleteDialog.afterClosed().subscribe((confirm: any) => {
      if (confirm === true) {
        this.form.files.splice(key, 1);
        if (attachment.id) {
          this.TopicAttachmentService.delete({
            attachmentId: attachment.id,
            topicId: this.topic.id
          }).pipe(take(1)).subscribe();
        }
      }
    });
  };
}

@Component({
  selector: 'topic-attachments-dialog',
  template: '',
})
export class TopicAttachmentsDialogComponent implements OnInit {
  private topicId:string = '';
  constructor(dialog: MatDialog, router: Router, route: ActivatedRoute, TopicService: TopicService, TopicAttachmentService: TopicAttachmentService) {
    route.params.pipe(
      switchMap((params) => {
        this.topicId = params['topicId'];
        return TopicService.get(params['topicId'])
      })
    ).pipe(take(1)).subscribe((topic) => {
      const attachmentsDialog = dialog.open(
        TopicAttachmentsComponent, {data: {
        topic
      }});

      attachmentsDialog.afterClosed().subscribe(() => {
        TopicAttachmentService.reset();
        TopicAttachmentService.params['topicId'] = this.topicId;
        router.navigate(['../'], {relativeTo: route})
      })
    });
  }

  ngOnInit(): void {
  }

}
