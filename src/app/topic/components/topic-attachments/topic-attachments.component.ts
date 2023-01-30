import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { UploadService } from 'src/app/services/upload.service';
import { TopicService } from 'src/app/services/topic.service';

export interface ArgumentReactionsData {
  topic: Topic
};

@Component({
  selector: 'app-topic-attachments',
  templateUrl: './topic-attachments.component.html',
  styleUrls: ['./topic-attachments.component.scss']
})
export class TopicAttachmentsComponent implements OnInit {
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
    @Inject(MAT_DIALOG_DATA) public data: ArgumentReactionsData,
    public TopicService: TopicService,
    private TopicAttachmentService: TopicAttachmentService,
    private Notification: NotificationService,
    private Translate: TranslateService,
    private Upload: UploadService) {
    this.topic = data.topic;
    this.config = app.config.get('attachments');
  }

  ngOnInit(): void {
  }
  uploadFile() {
    /* const input = document.getElementById('addFile')
     input.click();

     input.on('change', (e) => {
       const files = e.target['files'];
       this.selectFile(files);
     });*/
  };

  selectFile(files: any) {
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
        this.appendAttachment(attachment);
      }
    }
  };

  handleAttachment(attachment: any) {
    if (attachment) {
      this.appendAttachment(attachment);
    }
  }

  dropboxSelect() {
    this.TopicAttachmentService
      .dropboxSelect()
      .then(this.handleAttachment);
  };

  oneDriveSelect() {
    this.TopicAttachmentService
      .oneDriveSelect()
      .then(this.handleAttachment);
  };

  googleDriveSelect() {
    this.TopicAttachmentService
      .googleDriveSelect()
      .then(this.handleAttachment);
  };

  appendAttachment(attachment: any) {
    this.doSaveAttachment(attachment);
  };

  doSaveAttachment(attachment: any) {
    if (attachment.file) {
      this.Upload.topicAttachment(this.topic.id, attachment)
        .pipe(takeWhile((e) => !e.link))
        .subscribe((result) => {
          /*   this.form.files.push(result.data);
            }).catch((err) => {
              if (err.data.errors) {
                var keys = Object.keys(err.data.errors);
                keys.forEach(function (key) {
                  this.Notification.addError(err.data.errors[key]);
                });
              } else if (err.data.status && err.data.status.message) {
                this.Notification.addError(err.data.status.message);
              } else {
                this.Notification.addError(err.message);
              }*/
        });
    }
    attachment.topicId = this.topic.id;
    if (attachment.id) {
      //   this.TopicAttachmentService.update(attachment);
    } else {
      //   this.TopicAttachmentService.save(attachment);
    }

    this.form.files.push(attachment);
  };

  editAttachment(attachment: any) {
    attachment.editMode = !attachment.editMode;
    attachment.topicId = this.topic.id;
    if (!attachment.editMode && attachment.id) {
     // this.TopicAttachmentService.update(attachment);
    }
  };

  deleteAttachment(key: number, attachment: any) {
    const deleteDialog = this.dialog.open(ConfirmDialogComponent)

    deleteDialog.afterClosed().subscribe((confirm:any) => {
      if (confirm === true) {
        /*this.form.files.splice(key, 1);
        if (attachment.id) {
          this.TopicAttachmentService.delete({
            attachmentId: attachment.id,
            topicId: this.topic.id
          });
        }*/
      }
    })
    /*this.ngDialog
      .openConfirm({
        template: '/views/modals/topic_attachment_delete_confirm.html'
      })
      .then(() => {
        this.form.files.splice(key, 1);
        if (attachment.id) {
          this.TopicAttachment.delete({
            attachmentId: attachment.id,
            topicId: this.topic.id
          });
        }
      }, angular.noop);*/
  };
}
