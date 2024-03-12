import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Component, Inject, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take, takeWhile, switchMap, of, map } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { UploadService } from 'src/app/services/upload.service';
import { TopicService } from 'src/app/services/topic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Attachment } from 'src/app/interfaces/attachment';
import { trigger, state, style } from '@angular/animations';

@Component({
  selector: 'topic-attachments',
  templateUrl: './topic-attachments.component.html',
  styleUrls: ['./topic-attachments.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        minHeight: 'min-content',
        maxHeight: 'min-content',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        transition: '0.2s ease-in-out max-height'
      }))
    ]),
    trigger('openSlide', [
      // ...
      state('open', style({
        minHeight: 'auto',
        'maxHeight': '400px',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        minHeight: '80px',
        'maxHeight': '80px',
        transition: '0.2s ease-in-out max-height'
      }))
    ])]
})
export class TopicAttachmentsComponent implements OnInit {
  @ViewChild('attachmentInput') attachmentInput?: ElementRef;
  @ViewChild('attachmendDropdown') attachmentDropdown?: ElementRef;

  blockAttachments = false;
  @Input() topic!: Topic;
  public form = {
    files: <any[]>[],
    uploadfiles: <any[]>[]
  };
  private saveInProgress = false;
  config: any;

  topicAttachments$ = of(<Attachment[] | any[]>[]);
  attachments = <any[]>[];
  mobileActions = false;

  constructor(
    private dialog: DialogService,
    public app: AppService,
    public TopicService: TopicService,
    private TopicAttachmentService: TopicAttachmentService,
    private Notification: NotificationService,
    private Translate: TranslateService,
    private Upload: UploadService) {
    this.config = app.config.get('attachments');
  }

  ngOnInit(): void {
    this.TopicAttachmentService.setParam('topicId', this.topic.id);
    this.topicAttachments$ = this.TopicAttachmentService.loadItems().pipe(
      map((attachments) => {
        this.attachments = [];
        attachments.forEach((item) => {
          this.attachments.push(item);
        })
        if (attachments.length) {
          this.blockAttachments = true;
        }
        return attachments;
      })
    );

    this.TopicAttachmentService
      .query({ topicId: this.topic.id })
      .pipe(take(1)).subscribe((files: any) => {
        this.form.files = files.rows;
      });
  }

  closeDropdown() {
    document.dispatchEvent(new Event('click'));
    this.attachmentDropdown?.nativeElement.dispatchEvent(new Event('click'));
  }

  triggerUpload() {
    this.attachmentInput?.nativeElement.click();
    this.closeDropdown();
  };

  appendAttachment(attachment: any) {
    this.doSaveAttachment(attachment);
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


  dropboxSelect() {
    this.closeDropdown();
    this.TopicAttachmentService
      .dropboxSelect()
      .then((attachment) => {
        if (attachment) {
          this.doSaveAttachment(attachment);
        }
      });
  };

  oneDriveSelect() {
    this.closeDropdown();
    this.TopicAttachmentService
      .oneDriveSelect()
      .then((attachment) => {
        if (attachment) {
          this.doSaveAttachment(attachment);
        }
      });
  };

  googleDriveSelect() {
    this.closeDropdown();
    this.TopicAttachmentService
      .googleDriveSelect()
      .then((attachment) => {
        if (attachment) {
          this.doSaveAttachment(attachment);
        }
      });
  };

  getAllowedFileSize() {
    return (this.Upload.ALLOWED_FILE_SIZE / 1000 / 1000).toString() + 'MB';
  }

  getAllowedFileTypes() {
    return ["txt", "text", "bdoc", "asice", "ddoc", "conf", "def", "list", "log", "in", "ini", "pdf", "doc", "dot", "docx", "odt", "ods", "jpeg", "jpg", "jpe", "png", "rtf", "xls", "xlm", "xla", "xlc", "xlt", "xlw", "xlsx", "ppt", "pps", "pot", "pptx"].join(', ');
  }
  attachmentUpload(): void {
    const files = this.attachmentInput?.nativeElement.files;
    for (let i = 0; i < files.length; i++) {
      const attachment = {
        name: files[i].name,
        type: files[i].name.split('.').pop(),
        source: 'upload',
        size: files[i].size,
        file: files[i]
      };

      if (attachment.size > this.Upload.ALLOWED_FILE_SIZE) {
        const fileTypeError = this.Translate.instant('MSG_ERROR_ATTACHMENT_SIZE_OVER_LIMIT', { allowedFileSize: this.getAllowedFileSize() });
        this.Notification.addError(fileTypeError);
      } else if (this.Upload.ALLOWED_FILE_TYPES.indexOf(files[i].type) === -1) {
        const fileTypeError = this.Translate.instant('MSG_ERROR_ATTACHMENT_TYPE_NOT_ALLOWED', { allowedFileTypes: this.getAllowedFileTypes() });
        this.Notification.addError(fileTypeError);
      } else {
        //    this.attachments.push(attachment);
        this.doSaveAttachment(attachment);
      }
    }
  }

  doSaveAttachment(attachment: any) {
    attachment.topicId = this.topic.id;
    if (attachment.file) {
      this.Upload.topicAttachment(this.topic.id, attachment)
        .pipe(takeWhile((e) => !e.link, true))
        .subscribe({
          next: (result) => {
            if (result.link)
              this.attachments.push(result);
          },
          error: (res) => {
            /*   if (res.errors) {
                 const keys = Object.keys(res.errors);
                 keys.forEach((key) => {
                   this.Notification.addError(res.errors[key]);
                 });
               } else if (res.status && res.status.message) {
                 this.Notification.addError(res.status.message);
               } else {
                 this.Notification.addError(res.message);
               }*/
          }
        });
    }
    else if (attachment.id) {
      this.TopicAttachmentService.update(attachment).pipe(take(1)).subscribe(() => {
        //     this.attachments.push(attachment);
      });
    } else {
      this.TopicAttachmentService.save(attachment).pipe(take(1)).subscribe({
        next: (result) => {
          if (result.id) {
            attachment = result
            this.attachments.push(attachment);
          }
        },
        error: (res) => {
          console.error(res);
        }
      });
    }
  };
  removeAttachment(attachment: any) {
    this.attachments.splice(this.attachments.indexOf(attachment), 1);
    if (attachment.id) {
      this.TopicAttachmentService.delete({
        attachmentId: attachment.id,
        topicId: this.topic.id
      }).pipe(take(1)).subscribe();
    }
  }
}

@Component({
  selector: 'topic-attachments-dialog',
  template: '',
})
export class TopicAttachmentsDialogComponent implements OnInit {
  private topicId: string = '';
  constructor(dialog: DialogService, router: Router, route: ActivatedRoute, TopicService: TopicService, TopicAttachmentService: TopicAttachmentService) {
    route.params.pipe(
      switchMap((params) => {
        this.topicId = params['topicId'];
        return TopicService.get(params['topicId'])
      })
    ).pipe(take(1)).subscribe((topic) => {
      const attachmentsDialog = dialog.open(
        TopicAttachmentsComponent, {
        data: {
          topic
        }
      });

      attachmentsDialog.afterClosed().subscribe(() => {
        TopicAttachmentService.reset();
        TopicAttachmentService.params['topicId'] = this.topicId;
        router.navigate(['../'], { relativeTo: route })
      })
    });
  }

  ngOnInit(): void {
  }

}
