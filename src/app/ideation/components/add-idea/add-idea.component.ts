import { IdeaAttachmentService } from '@services/idea-attachment.service';
import { TopicIdeationService } from '@services/topic-ideation.service';
import { TopicIdeaService } from '@services/topic-idea.service';
import { TopicMemberUserService } from '@services/topic-member-user.service';
import { AppService } from '@services/app.service';
import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/notification.service';
import { UploadService } from '@services/upload.service';

import { Attachment } from '@interfaces/attachment';
import { Idea, IdeaStatus } from '@interfaces/idea';
import { Notification } from '@interfaces/notification';
import { Ideation } from '@interfaces/ideation';
import { MarkdownDirective } from 'src/app/directives/markdown.directive';
import { DialogService } from '@shared/dialog';
import { AnonymousDialogComponent } from '../anonymous-dialog/anonymous-dialog.component';
import { AnonymousDraftDialogComponent } from '../anonymous-draft-dialog/anonymous-draft-dialog.component';

import { trigger, state, style } from '@angular/animations';
import {
  Component,
  Input,
  Inject,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take, map, takeWhile, of, lastValueFrom } from 'rxjs';
import { CloseWithoutSavingDialogComponent } from '../close-without-saving-dialog/close-without-saving-dialog.component';
import { municipalities } from '@services/municipalitiy.service';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'add-idea',
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.scss'],
  animations: [
    trigger('openSlide', [
      // ...
      state(
        'open',
        style({
          maxHeight: '100%',
          transition: 'max-height 0.2s ease-in-out',
        })
      ),
      state(
        'closed',
        style({
          padding: '0',
          maxHeight: '0',
          transition: 'all 0.2s ease-in-out',
        })
      ),
    ]),
  ],
})
export class AddIdeaComponent {
  @Input() topicId!: string;
  @Input() ideation!: Ideation;
  @Input() ideationId!: string;
  @Input() topicCountry!: string | null;
  @Input() notification?: Notification;
  @Output() notificationChange = new EventEmitter<any>();

  @ViewChild(MarkdownDirective) editor!: MarkdownDirective;
  @ViewChild('imageUpload') fileInput?: ElementRef;

  tmpImageUrl?: string;
  images = <any[]>[];
  newImages = <any[]>[];
  topicAttachments$ = of(<Attachment[] | any[]>[]);
  attachments = <any[]>[];

  wWidth = window.innerWidth;
  focusIdeaStatement = false;
  argumentType = 'pro';
  errors: any;
  addIdea;
  description = '';
  initialValue = '';
  ideaForm = new UntypedFormGroup({
    statement: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.required]),
    demographics_age: new UntypedFormControl(''),
    demographics_gender: new UntypedFormControl(''),
    demographics_residence: new UntypedFormControl(''),
  });

  filtersData = {
    residence: {
      error: false,
      isMobileOpen: false,
      placeholder: 'VIEWS.IDEATION_CREATE.DEMOGRAPHICS_DATA_RESIDENCE',
      selectedValue: '',
      preSelectedValue: '',
      items: [
        ...municipalities.map((value) => {
          return { title: value.name, value: value.name };
        }),
      ],
    },
    gender: {
      error: false,
      isMobileOpen: false,
      placeholder: 'VIEWS.IDEATION_CREATE.DEMOGRAPHICS_DATA_GENDER',
      selectedValue: '',
      preSelectedValue: '',
      items: [
        ...['female', 'male', 'other'].map((value) => {
          return {
            title: `VIEWS.IDEATION_CREATE.DEMOGRAPHICS_DATA_GENDER_${value.toUpperCase()}`,
            value: value,
          };
        }),
      ],
    },
  };

  AGE_LIMIT = 110;
  IMAGE_LIMIT = 10;
  IDEA_STATEMENT_MAXLENGTH = 1024;
  private readonly IDEA_VERSION_SEPARATOR = '_v';
  constructor(
    public app: AppService,
    private readonly AuthService: AuthService,
    private readonly TopicIdeationService: TopicIdeationService,
    private readonly UploadService: UploadService,
    readonly IdeaAttachmentService: IdeaAttachmentService,
    private readonly Notification: NotificationService,
    public readonly TopicIdeaService: TopicIdeaService,
    public readonly Location: LocationService,
    private readonly TopicMemberUserService: TopicMemberUserService,
    private readonly dialog: DialogService,
    @Inject(ActivatedRoute) readonly route: ActivatedRoute,
    @Inject(TranslateService) public readonly translate: TranslateService,
    @Inject(Router) readonly router: Router
  ) {
    this.addIdea = this.app.addIdea.pipe(
      map((val) => {
        this.description = this.initialValue;
        this.ideaForm.reset();
        this.newImages = [];
        this.images = [];
        return val;
      })
    );
  }

  ngOnInit(): void {
    this.initialValue = this.ideation.template || '';
    this.IdeaAttachmentService.setParam('topicId', this.topicId);
    this.IdeaAttachmentService.setParam('ideationId', this.ideationId);
  }

  get isStatementValid() {
    return this.ideaForm.controls['statement'].valid;
  }

  get filterKeys() {
    return Object.keys(this.filtersData) as Array<
      keyof typeof this.filtersData
    >;
  }

  get hasMobileOpen() {
    return Object.values(this.filtersData).some(
      (filter) => filter.isMobileOpen
    );
  }

  get isCountryEstonia() {
    return this.topicCountry === 'Estonia';
  }

  loggedIn() {
    return this.AuthService.loggedIn$.value;
  }

  ideaMaxLength() {
    return 0;
  }

  updateText(text: any) {
    this.ideaForm.controls['description'].markAsUntouched();
    this.ideaForm.controls['description'].setValue(text);
  }

  ngModelChange(key: string, value: number | string | null) {
    this.ideaForm.controls[key].markAsUntouched();

    if (value !== null && key === 'demographics_age') {
      if ((value as number) > this.AGE_LIMIT) {
        this.ideaForm.controls[key].setValue(this.AGE_LIMIT);
      } else if ((value as number) < 0) {
        this.ideaForm.controls[key].setValue(0);
      }
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ngModelBlur(key: string) {
    this.ideaForm.controls[key].markAsUntouched();
  }

  addNewIdea() {
    if (!this.loggedIn()) {
      const redirectSuccess = this.Location.getAbsoluteUrl(window.location.pathname) + window.location.search
      this.app.doShowLogin(redirectSuccess);
    } else {
      this.app.addIdea.next(true);
    }
  }

  close() {
    if (
      this.ideaForm.controls['statement'].value ||
      this.ideaForm.controls['description'].value
    ) {
      const dialog = this.dialog.open(CloseWithoutSavingDialogComponent);

      dialog.afterClosed().subscribe({
        next: (res) => {
          if (!res) {
            this.app.addIdea.next(false);
            this.clear();
          }
        },
      });
    } else {
      this.app.addIdea.next(false);
      this.clear();
    }
  }

  clear() {
    this.ideaForm.reset();
    this.updateText(this.initialValue);
    this.description = this.initialValue;
    this.ideaForm.patchValue({
      statement: '',
      description: this.initialValue,
    });
    this.ideaForm.markAsUntouched();
    this.ideaForm.controls['statement'].patchValue('');
    this.ideaForm.controls['description'].markAsPristine();
    this.ideaForm.controls['description'].markAsUntouched();
    this.filtersData.residence.error = false;
    this.filtersData.residence.selectedValue = '';
    this.filtersData.gender.error = false;
    this.filtersData.gender.selectedValue = '';
    setTimeout(() => {
      if (this.fileInput?.nativeElement.value)
        this.fileInput.nativeElement.value = null;
      this.ideaForm.controls['description'].markAsPristine();
      this.ideaForm.controls['description'].markAsUntouched();
      this.ideaForm.markAsUntouched();
    });
  }

  validateRequiredFieldsForPublish() {
    this.ideaForm.controls['description'].markAsTouched();
    this.ideaForm.controls['demographics_age'].markAsTouched();
    this.ideaForm.controls['demographics_gender'].markAsTouched();
    this.ideaForm.controls['demographics_residence'].markAsTouched();
    if (!this.filtersData.residence.selectedValue) {
      this.filtersData.residence.error = true;
    }

    if (!this.filtersData.gender.selectedValue) {
      this.filtersData.gender.error = true;
    }
  }

  resetRequiredFieldsForPublish() {
    this.ideaForm.controls['description'].markAsUntouched();
    this.ideaForm.controls['demographics_age'].markAsUntouched();
    this.ideaForm.controls['demographics_gender'].markAsUntouched();
    this.ideaForm.controls['demographics_residence'].markAsUntouched();
    this.filtersData.residence.error = false;
    this.filtersData.gender.error = false;
  }

  postIdea(status?: IdeaStatus) {
    this.ideaForm.controls['statement'].markAsTouched();
    this.validateRequiredFieldsForPublish();

    if (this.ideaForm.valid) {
      if (this.ideation.allowAnonymous) {
        const invitationDialog = this.dialog.open(AnonymousDialogComponent);

        invitationDialog.afterClosed().subscribe({
          next: (res) => {
            if (res) {
              this.saveIdea(status);
            }
          },
        });
      } else {
        this.saveIdea(status);
      }
    }
  }

  getDemographicKeys() {
    return Object.keys(this.ideation.demographicsConfig || {});
  }

  draftIdea() {
    this.ideaForm.controls['statement'].markAsTouched();
    this.resetRequiredFieldsForPublish();

    if (this.isStatementValid) {
      if (this.ideation.allowAnonymous) {
        const isDemographicsRequested =
          this.ideaForm.controls['demographics_age'].value ||
          this.ideaForm.controls['demographics_gender'].value ||
          this.ideaForm.controls['demographics_residence'].value;

        if (isDemographicsRequested) {
          const invitationDialog = this.dialog.open(
            AnonymousDraftDialogComponent
          );

          invitationDialog.afterClosed().subscribe({
            next: (res) => {
              if (res) {
                this.saveIdea(IdeaStatus.draft);
              }
            },
          });
        } else {
          this.saveIdea(IdeaStatus.draft);
        }
      } else {
        this.saveIdea(IdeaStatus.draft);
      }
    }
  }

  publishIdea() {
    this.postIdea(IdeaStatus.published);
  }

  afterPost(idea: Idea) {
    this.doSaveAttachments(idea.id);
    this.TopicIdeaService.reload();
    this.TopicIdeationService.reload();
    this.TopicMemberUserService.reload();
    this.description = '';
    this.ideaForm.reset();
    this.clear();
    this.app.addIdea.next(false);
    this.afterPostNavigate(idea);
  }

  afterPostNavigate(idea: Idea) {
    if (idea.status !== IdeaStatus.draft) {
      this.router.navigate(['ideation', this.ideationId, 'ideas', idea.id], {
        relativeTo: this.route,
      });
    }
  }

  getDemographicValues(): Idea['demographics'] {
    if (!this.ideation.demographicsConfig) {
      return null;
    }

    return Object.keys(this.ideation.demographicsConfig).reduce(
      (acc: Idea['demographics'], curr: string) => {
        if (curr === 'residence' && this.isCountryEstonia) {
          return {
            ...acc,
            residence: this.filtersData.residence.selectedValue,
          };
        }
        if (curr === 'gender') {
          return {
            ...acc,
            gender:
              this.ideation.demographicsConfig?.[curr].value ||
              this.filtersData.gender.selectedValue,
          };
        }
        return {
          ...acc,
          [curr]: this.ideation.demographicsConfig?.[curr].value || '',
        };
      },
      null
    );
  }

  saveIdea(status?: IdeaStatus) {
    /**
     * @todo Fix types for ideaData.
     */
    const ideaData: Partial<Idea> & { parentVersion: number; topicId: string } =
      {
        parentVersion: 0,
        statement: this.ideaForm.value['statement'],
        description: this.ideaForm.value['description'],
        topicId: this.topicId,
        status: status,
        ideationId: this.ideation.id,
        demographics: this.getDemographicValues(),
      };

    /**
     * @note Description is not nullable in DB and to avoid updateing DB field,
     * we need to set it to empty string if it's a draft.
     *
     * @see https://github.com/citizenos/citizenos-fe/issues/1954
     */
    if (status === IdeaStatus.draft && !this.ideaForm.value['description']) {
      ideaData.description = '';
    }

    this.TopicIdeaService.save(ideaData)
      .pipe(take(1))
      .subscribe({
        next: (idea) => {
          this.afterPost(idea);
        },
        error: (err) => {
          console.error(err);
          this.errors = err;
        },
      });
  }

  getIdeaIdWithVersion(ideaId: string, version: number) {
    return ideaId + this.IDEA_VERSION_SEPARATOR + version;
  }

  fileUpload() {
    const allowedTypes = [
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
    ];
    const files = this.fileInput?.nativeElement.files;
    if (this.images.length + this.newImages.length >= this.IMAGE_LIMIT) {
      return this.Notification.addError(
        this.translate.instant('MSG_ERROR_IDEA_IMAGE_LIMIT', {
          limit: this.IMAGE_LIMIT,
        })
      );
    }
    for (let i = 0; i < files.length; i++) {
      if (allowedTypes.indexOf(files[i].type) < 0) {
        this.Notification.addError(
          this.translate.instant('MSG_ERROR_FILE_TYPE_NOT_ALLOWED', {
            allowedFileTypes: allowedTypes.toString(),
          })
        );
      } else if (files[i].size > 5000000) {
        this.Notification.addError(
          this.translate.instant('MSG_ERROR_FILE_TOO_LARGE', {
            allowedFileSize: '5MB',
          })
        );
      } else if (this.images.length + i < this.IMAGE_LIMIT) {
        const reader = new FileReader();
        reader.onload = () => {
          const file = files[i];
          file.link = reader.result;
          this.newImages.push(file);
        };
        reader.readAsDataURL(files[i]);
      } else {
        this.Notification.addError(
          this.translate.instant('MSG_ERROR_IDEA_IMAGE_LIMIT', {
            limit: this.IMAGE_LIMIT,
          })
        );
      }
    }
  }

  uploadImage() {
    this.fileInput?.nativeElement.click();
  }

  getAllowedFileSize() {
    return (
      (this.UploadService.ALLOWED_FILE_SIZE / 1000 / 1000).toString() + 'MB'
    );
  }

  getAllowedFileTypes() {
    return ['jpg', 'jpeg', 'img', 'png'].join(', ');
  }

  async doSaveAttachments(ideaId: string) {
    let errorsCounter = 0;
    document.querySelector("body")?.classList.add("images_loading")
    for await (const image of this.newImages) {
      if (image) {
        image.source = this.IdeaAttachmentService.SOURCES.upload;
        const uploadIdeaImage = this.UploadService.uploadIdeaImage(
          { topicId: this.topicId, ideationId: this.ideation.id, ideaId },
          image,
          { name: image.name }
        )
          .pipe(takeWhile((e) => !e.link, true))

        try {
          await lastValueFrom(uploadIdeaImage)
        } catch (error) {
          errorsCounter++
        }
      }
    }
    if (errorsCounter > 0) {
      this.Notification.addError(
        this.translate.instant('MSG_ERROR_POST_API_USERS_TOPICS_IDEATIONS_IDEAS_IMAGE_UPLOAD_500')
      );
    } else {
      window.location.reload()
    }
    document.querySelector("body")?.classList.remove("images_loading")

  }

  setFilterValue(filter: keyof typeof this.filtersData, val: string) {
    this.filtersData[filter].selectedValue = val;
    this.filtersData[filter].error = false;
  }

  removeNewImage(index: number) {
    this.newImages.splice(index, 1);
  }
}
