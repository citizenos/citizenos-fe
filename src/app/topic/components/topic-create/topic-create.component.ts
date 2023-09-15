import { trigger, state, style } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, map } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { ConfigService } from 'src/app/services/config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SearchService } from 'src/app/services/search.service';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { TopicService } from 'src/app/services/topic.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-topic-create',
  templateUrl: './topic-create.component.html',
  styleUrls: ['./topic-create.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        minHeight: 'min-content',
        maxHeight: 'min-content',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        overflowY: 'hidden',
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
export class TopicCreateComponent implements OnInit {

  @ViewChild('imageUpload') fileInput?: ElementRef;
  @ViewChild('attachmentInput') attachmentInput?: ElementRef;

  languages$: { [key: string]: any } = this.config.get('language').list;
  titleLimit = 100;
  introLimit = 500;

  topic: Topic = <Topic>{
    title: '',
    intro: '',
    description: '',
    imageUrl: '',
    members: {
      users: <any[]>[],
      topics: <Topic[]>[]
    },
    visibility: this.TopicService.VISIBILITY.private,
    categories: <string[]>[]
  };

/*TODO - handle these below*/
  attachments = <any[]>[];
  tags = <any[]>[];
/**/
  VISIBILITY = this.TopicService.VISIBILITY;
  CATEGORIES = Object.keys(this.TopicService.CATEGORIES);
  errors?: any;
  tmpImageUrl?: string;
  imageFile?: any;
  tabSelected;
  showHelp = false;
  tabs = ['info', 'settings', 'add_topics', 'invite'];
  block = {
    attachments: false,
    headerImage: false,
    title: false,
    intro: false,
    description: false
  }

  searchStringUser = '';
  searchResultUsers$ = of(<any>[]);
  invalid = <any[]>[];
  members = <any[]>[];
  groupLevel = 'read';
  maxUsers = 550;
  private EMAIL_SEPARATOR_REGEXP = /[;,\s]/ig;

  constructor(
    private app: AppService,
    public TopicService: TopicService,
    private Upload: UploadService,
    public translate: TranslateService,
    private Notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private Search: SearchService,
    private TopicAttachmentService: TopicAttachmentService,
    private TopicInviteUserService: TopicInviteUserService,
    private config: ConfigService) {
    this.app.darkNav = true;
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('info')
        }
        return fragment
      }
      ));
   // app.createNewTopic();
  }
  ngOnInit(): void {
  }

  selectTab(tab: string) {
    this.router.navigate([], { fragment: tab });
  }

  previousTab(tab: string | void) {
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > 0) {
        this.selectTab(this.tabs[tabIndex - 1]);
      }
    }
  }

  nextTab(tab: string | void) {
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > -1 && tabIndex < 3) {
        this.selectTab(this.tabs[tabIndex + 1]);
      }
    }
  }

  fileUpload() {
    const files = this.fileInput?.nativeElement.files;
    this.imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      return (e: any) => {
        this.tmpImageUrl = e.target.result;
      };
    })();
    reader.readAsDataURL(files[0]);
  }

  fileDroped(files: any) {
    this.imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      return (e: any) => {
        this.tmpImageUrl = e.target.result;
      };
    })();
    reader.readAsDataURL(files[0]);
  }
  uploadImage() {
    this.fileInput?.nativeElement.click();
  };

  deleteTopicImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }
    this.imageFile = null;
    this.tmpImageUrl = undefined;
  }

  chooseCategory(category: string) {
    if (this.topic.categories && this.topic.categories.indexOf(category) > -1) {
      this.topic.categories.splice(this.topic.categories.indexOf(category), 1);
    } else {
      this.topic.categories?.push(category);
    }
  }

  createTopic () {
    this.app.createNewTopic(this.topic.title, this.topic.visibility);
  }

  triggerUpload() {
    this.attachmentInput?.nativeElement.click();
  };

  dropboxSelect() {
    this.TopicAttachmentService
      .dropboxSelect()
      .then((attachment) => {
        if (attachment) {
          this.attachments.push(attachment);
     //     this.doSaveAttachment(attachment);
        }
      });
  };

  oneDriveSelect() {
    this.TopicAttachmentService
      .oneDriveSelect()
      .then((attachment) => {
        if (attachment) {
          this.attachments.push(attachment);
        //  this.doSaveAttachment(attachment);
        }
      });
  };

  googleDriveSelect() {
    this.TopicAttachmentService
      .googleDriveSelect()
      .then((attachment) => {
        if (attachment) {
          this.attachments.push(attachment);
         // this.doSaveAttachment(attachment);
        }
      });
  };

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
      console.log(attachment);
      if (attachment.size > 50000000) {
        this.Notification.addError('MSG_ERROR_ATTACHMENT_SIZE_OVER_LIMIT');
      } else if (this.Upload.ALLOWED_FILE_TYPES.indexOf(attachment.type.toLowerCase()) === -1) {
        const fileTypeError = this.translate.instant('MSG_ERROR_ATTACHMENT_TYPE_NOT_ALLOWED', { allowedFileTypes: this.Upload.ALLOWED_FILE_TYPES.toString() });
        this.Notification.addError(fileTypeError);
      } else {
        this.attachments.push(attachment);
       // this.doSaveAttachment(attachment);
      }
    }
  }

  removeAttachment (attachment: any) {
    this.attachments.splice(this.attachments.indexOf(attachment), 1);
  }

  addTag(e: Event) {
    const tag = (e.target as HTMLInputElement).value;
    if (tag)
      this.tags.push(tag);
      (e.target as HTMLInputElement).value = '';
  }

  removeTag (tag: string) {
    this.tags.splice(this.tags.indexOf(tag), 1);
  }
}
