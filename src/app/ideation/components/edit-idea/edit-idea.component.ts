import { trigger, state, style } from '@angular/animations';
import { Component, Input, Inject, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, take, takeWhile } from 'rxjs';
import { Idea } from 'src/app/interfaces/idea';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { IdeaAttachmentService } from 'src/app/services/idea-attachment.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'edit-idea',
  templateUrl: './edit-idea.component.html',
  styleUrls: ['./edit-idea.component.scss'],
  animations: [
    trigger('openSlide', [
      // ...
      state('open', style({
        'maxHeight': '100%',
        transition: 'max-height 0.2s ease-in-out',
      })),
      state('closed', style({
        padding: '0',
        'maxHeight': '0',
        transition: 'all 0.2s ease-in-out',
      }))
    ])]
})
export class EditIdeaComponent {
  @Input() topicId!: string;
  @Input() ideationId!: string;
  @Input() idea!: Idea;
  @Output() showEdit = new EventEmitter<boolean | null>();
  @ViewChild('imageUpload') fileInput?: ElementRef;

  wWidth = window.innerWidth;
  focusIdeaStatement = false;
  argumentType = <string>'pro';
  errors: any;
  images = <any[]>[];
  newImages = <any[]>[];
  description = <string>'';
  ideaForm = new UntypedFormGroup({
    statement: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.required]),
  });

  IDEA_STATEMENT_MAXLENGTH = 1024;
  private IDEA_VERSION_SEPARATOR = '_v';
  constructor(
    public app: AppService,
    private AuthService: AuthService,
    public TopicIdeaService: TopicIdeaService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(IdeaAttachmentService) private IdeaAttachmentService: IdeaAttachmentService,
    @Inject(UploadService) private UploadService: UploadService,
    @Inject(NotificationService) private Notification: NotificationService,
    @Inject(TranslateService) public translate: TranslateService,
    @Inject(Router) private router: Router) { }

  ngOnInit(): void {
    this.ideaForm.patchValue({
      statement: this.idea.statement,
      description: this.idea.description
    });
    this.description = this.idea.description;
    this.updateText(this.idea.description);
    this.IdeaAttachmentService
      .query({ topicId: this.topicId, ideationId: this.idea.ideationId, ideaId: this.idea.id, type: 'image' })
      .pipe(take(1))
      .subscribe((res: any) => {
        this.images = res.rows;
        return of(this.images)
      });
  }

  loggedIn() {
    return this.AuthService.loggedIn$.value;
  }

  ideaMaxLength() {
    return 0;
  }

  updateText(text: any) {
    this.ideaForm.controls['description'].markAsTouched();
    this.ideaForm.controls['description'].setValue(text);
  }

  addNewIdea() {
    if (!this.loggedIn()) {
      this.app.doShowLogin();
    } else {
      this.app.addIdea.next(true);
    }
  }

  close() {
    this.app.addIdea.next(false);
  }

  postIdea() {
    const idea = {
      ideaId: this.idea.id,
      ideationId: this.idea.ideationId,
      parentVersion: 0,
      statement: this.ideaForm.value['statement'],
      description: this.ideaForm.value['description'],
      topicId: this.topicId
    };
    this.TopicIdeaService
      .update(idea)
      .pipe(take(1))
      .subscribe({
        next: (idea) => {
          this.TopicIdeaService.reset();
          this.TopicIdeaService.setParam('topicId', this.topicId);
          this.TopicIdeaService.setParam('ideationId', this.idea.ideationId);
          this.description = '';
          this.ideaForm.reset();
          this.app.addIdea.next(false);
          this.TopicIdeaService.reloadIdeas();
          this.idea.statement = idea.statement;
          this.idea.description = idea.description;
          this.showEdit.emit(false);

          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: { ideaId: idea.id }
            });
        },
        error: (err) => {
          console.error(err);
          this.errors = err;
        }
      })
  };

  ideaEditMode() {
    this.ideaForm.patchValue({ 'statement': this.idea.statement });
    this.ideaForm.patchValue({ 'description': this.idea.description });
    console.log('TERE')
    this.showEdit.emit(false);
  };

  fileUpload() {
    const allowedTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];
    const files = this.fileInput?.nativeElement.files;
    if (allowedTypes.indexOf(files[0].type) < 0) {
      this.Notification.addError(this.translate.instant('MSG_ERROR_FILE_TYPE_NOT_ALLOWED', { allowedFileTypes: allowedTypes.toString() }));
    } else if (files[0].size > 5000000) {
      this.Notification.addError(this.translate.instant('MSG_ERROR_FILE_TOO_LARGE', { allowedFileSize: '5MB' }));
    } else {
      this.images.push(files[0]);
    }
  }

  uploadImage() {
    this.fileInput?.nativeElement.click();
  };

  getAllowedFileSize() {
    return (this.UploadService.ALLOWED_FILE_SIZE / 1000 / 1000).toString() + 'MB';
  }

  getAllowedFileTypes() {
    return ["jpg", "jpeg", "img", "png"].join(', ');
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

      if (attachment.size > this.UploadService.ALLOWED_FILE_SIZE) {
        const fileTypeError = this.translate.instant('MSG_ERROR_ATTACHMENT_SIZE_OVER_LIMIT', { allowedFileSize: this.getAllowedFileSize() });
        this.Notification.addError(fileTypeError);
      } else if (this.UploadService.ALLOWED_FILE_TYPES.indexOf(files[i].type) === -1) {
        const fileTypeError = this.translate.instant('MSG_ERROR_ATTACHMENT_TYPE_NOT_ALLOWED', { allowedFileTypes: this.getAllowedFileTypes() });
        this.Notification.addError(fileTypeError);
      }
    }
  }

  doSaveAttachments(ideaId: string) {
    let i = 0;
    while (i < this.images.length) {
      let image = this.images[i];
      if (image) {
        image.source = this.IdeaAttachmentService.SOURCES.upload;
        this.UploadService.uploadIdeaImage({topicId: this.topicId, ideationId: this.ideationId, ideaId}, image, {name: image.name})
          .pipe(takeWhile((e) => !e.link, true))
          .subscribe({
            next: (result) => {
              this.images.splice(i, 1);
            },
            error: (res) => {
              this.images.splice(i, 1);
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
      i++;
    }
  };

  removeImage (image: any, index: number) {
    return this.IdeaAttachmentService.delete({
      topicId: this.topicId,
      ideationId: this.ideationId,
      ideaId: this.idea.id,
      attachmentId: image.id
    }).pipe(take(1)).subscribe({
      next:() => {
        this.images.splice(index, 1);
      }
    });
  }
  removeNewImage(index: number) {
    this.newImages.splice(index, 1);
  }
}
