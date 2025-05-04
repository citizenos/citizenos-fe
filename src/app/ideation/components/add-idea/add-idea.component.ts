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
import {
  take,
  map,
  takeWhile,
  of,
  lastValueFrom,
  Subscription,
  interval,
} from 'rxjs';
import { CloseWithoutSavingDialogComponent } from '../close-without-saving-dialog/close-without-saving-dialog.component';
import { municipalities } from '@services/municipalitiy.service';
import { LocationService } from '@services/location.service';
import { ImageService } from '@services/images.service';

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

  autosavedIdea: Idea | null = null;
  isAutosaving = false;

  isPublished = false;
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
  private readonly AUTOSAVE_TIME = 15000;
  // Delay for the autosave notification to hide
  // after the autosave is completed
  // to avoid jumping of the notification
  private readonly AUTOSAVE_HIDE_DELAY = 2000;

  private autosaveSubscription?: Subscription;

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
    private imageService: ImageService,
    @Inject(ActivatedRoute) readonly route: ActivatedRoute,
    @Inject(TranslateService) public readonly translate: TranslateService,
    @Inject(Router) readonly router: Router
  ) {
    this.addIdea = this.app.addIdea.pipe(
      map((val) => {
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

  ngOnDestroy(): void {
    if (this.autosaveSubscription && !this.autosaveSubscription.closed) {
      this.autosaveSubscription.unsubscribe();
      this.TopicIdeaService.reload();
    }
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

  startAutosave(): void {
    this.autosaveSubscription = interval(this.AUTOSAVE_TIME).subscribe(() => {
      this.saveIdea(IdeaStatus.draft, true);
    });
  }

  updateText(text: any) {
    const prevValue = this.ideaForm.controls['description'].value;
    this.ideaForm.controls['description'].markAsUntouched();
    this.ideaForm.controls['description'].setValue(text);

    if (this.app.addIdea.value || this.app.editIdea.value) {
      const isValueChanged = text && prevValue && text !== prevValue;
      const isNotSubscribed =
        !this.autosaveSubscription || this.autosaveSubscription.closed;

      if (isValueChanged && isNotSubscribed && !this.isPublished) {
        this.startAutosave();
      }
    }
  }

  ngModelChange(key: string, value: number | string | null) {
    if (this.app.addIdea.value || this.app.editIdea.value) {
      this.ideaForm.controls[key].markAsUntouched();

      const isNotSubscribed =
        !this.autosaveSubscription || this.autosaveSubscription.closed;

      if (
        key === 'statement' &&
        value &&
        value.toString().trim().length > 0 &&
        isNotSubscribed &&
        !this.isPublished
      ) {
        this.startAutosave();
      }

      if (value !== null && key === 'demographics_age') {
        if ((value as number) > this.AGE_LIMIT) {
          this.ideaForm.controls[key].setValue(this.AGE_LIMIT);
        } else if ((value as number) < 0) {
          this.ideaForm.controls[key].setValue(0);
        }
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
      const redirectSuccess =
        this.Location.getAbsoluteUrl(window.location.pathname) +
        window.location.search;
      this.app.doShowLogin(redirectSuccess);
    } else {
      this.app.addIdea.next(true);
    }
  }

  close() {
    const isSubscribed = this.autosaveSubscription?.closed === false;
    if (isSubscribed) {
      const dialog = this.dialog.open(CloseWithoutSavingDialogComponent);

      dialog.afterClosed().subscribe({
        next: (res) => {
          if (!res) {
            this, this.saveIdea(IdeaStatus.draft);
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

    if (this.autosaveSubscription && !this.autosaveSubscription.closed) {
      this.autosaveSubscription.unsubscribe();
      this.TopicIdeaService.reload();
      this.autosavedIdea = null;
    }
  }

  validateRequiredFieldsForPublish() {
    this.ideaForm.controls['statement'].markAsTouched();
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

  postIdea(status?: IdeaStatus) {
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

  deleteDraftIdea(_idea: Partial<Idea>) {
    if (_idea) {
      const idea = {
        topicId: this.topicId,
        ideaId: _idea.id,
        ideationId: _idea.ideationId,
      };

      this.TopicIdeaService.delete(idea).subscribe(() => {
        this.app.addIdea.next(false);
        this.clear();
      });
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
        if (curr === 'residence') {
          const prefix = this.translate.instant(
            'COMPONENTS.ADD_IDEA.RESIDENCE_VALUE_PREFIX'
          );

          return {
            ...acc,
            residence: this.isCountryEstonia
              ? this.filtersData.residence.selectedValue
              : prefix + this.ideation.demographicsConfig?.[curr].value,
          };
        }
        if (curr === 'gender') {
          const prefix = this.translate.instant(
            'COMPONENTS.ADD_IDEA.GENDER_VALUE_PREFIX'
          );

          return {
            ...acc,
            gender:
              prefix + this.ideation.demographicsConfig?.[curr].value ||
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

  saveIdea(status: IdeaStatus | undefined, isAutosave = false) {
    /**
     * @todo Fix types for ideaData.
     */
    const ideaData: Partial<Idea> & {
      parentVersion: number;
      topicId: string;
      ideaId?: string;
    } = {
      ...(this.autosavedIdea && {
        ideaId: this.autosavedIdea.id,
        ideationId: this.autosavedIdea.ideationId,
      }),
      parentVersion: 0,
      statement: this.ideaForm.controls['statement'].value,
      description: this.ideaForm.controls['description'].value,
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
    if (status === IdeaStatus.draft) {
      if (!this.ideaForm.value['description']) {
        ideaData.description = '';
      }
      if (!this.ideaForm.value['statement']) {
        ideaData.statement = '';
      }
    }

    if (isAutosave) {
      this.isAutosaving = true;
    }

    if (this.autosavedIdea) {
      this.TopicIdeaService.update(ideaData).subscribe({
        next: (idea) => {
          if (isAutosave) {
            this.autosavedIdea = idea;

            setTimeout(() => {
              this.isAutosaving = false;
            }, this.AUTOSAVE_HIDE_DELAY);
          } else {
            this.afterPost(idea);
          }
        },
        error: (err) => {
          console.error(err);

          setTimeout(() => {
            this.isAutosaving = false;
          }, this.AUTOSAVE_HIDE_DELAY);
        },
      });
    } else {
      this.TopicIdeaService.save(ideaData)
        .pipe(take(1))
        .subscribe({
          next: (idea) => {
            if (isAutosave) {
              this.autosavedIdea = idea;

              setTimeout(() => {
                this.isAutosaving = false;
              }, this.AUTOSAVE_HIDE_DELAY);
            } else {
              this.afterPost(idea);
            }
          },
          error: (err) => {
            console.error(err);
            this.errors = err;

            setTimeout(() => {
              this.isAutosaving = false;
            }, this.AUTOSAVE_HIDE_DELAY);
          },
        });
    }
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
    const uploadedImages = [];
    this.imageService.setLoading(true);
    for await (const image of this.newImages) {
      if (image) {
        image.source = this.IdeaAttachmentService.SOURCES.upload;
        const uploadIdeaImage = this.UploadService.uploadIdeaImage(
          { topicId: this.topicId, ideationId: this.ideation.id, ideaId },
          image,
          { name: image.name }
        ).pipe(takeWhile((e) => !e.link, true));

        try {
          const uploadedImage = await lastValueFrom(uploadIdeaImage);
          uploadedImages.push(uploadedImage);
        } catch (error) {
          errorsCounter++;
        }
      }
    }
    if (errorsCounter > 0) {
      this.Notification.addError(
        this.translate.instant(
          'MSG_ERROR_POST_API_USERS_TOPICS_IDEATIONS_IDEAS_IMAGE_UPLOAD_500'
        )
      );
    }
    this.imageService.setLoading(false);
    this.imageService.updateImages(uploadedImages);
  }

  setFilterValue(filter: keyof typeof this.filtersData, val: string) {
    this.filtersData[filter].selectedValue = val;
    this.filtersData[filter].error = false;
  }

  removeNewImage(index: number) {
    this.newImages.splice(index, 1);
  }
}
