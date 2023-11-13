import { trigger, state, style } from '@angular/animations';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, map, Observable, take, takeWhile } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { ConfigService } from 'src/app/services/config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { TopicService } from 'src/app/services/topic.service';
import { UploadService } from 'src/app/services/upload.service';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { TopicInviteDialogComponent } from 'src/app/topic/components/topic-invite/topic-invite.component';
import { TopicParticipantsDialogComponent } from 'src/app/topic/components/topic-participants/topic-participants.component';
import { InviteEditorsComponent } from 'src/app/topic/components/invite-editors/invite-editors.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Attachment } from 'src/app/interfaces/attachment';
import { TopicVoteCreateComponent } from 'src/app/topic/components/topic-vote-create/topic-vote-create.component';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { countries } from 'src/app/services/country.service';
import { languages } from 'src/app/services/language.service';
import { InterruptDialogComponent } from 'src/app/shared/components/interrupt-dialog/interrupt-dialog.component';

@Component({
  selector: 'app-vote-create',
  templateUrl: './vote-create.component.html',
  styleUrls: ['./vote-create.component.scss'],
  animations: [
    trigger('readMore', [
      state('open', style({
        maxHeight: '100%',
        transition: '0.1s max-height'
      })),
      state('closed', style({
        maxHeight: '320px',
        transition: '0.1s max-height'
      }))
    ]),
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
export class VoteCreateComponent implements OnInit {
  topicText?: ElementRef
  readMoreButton = false;
  @ViewChild('topicText') set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
      this.topicText = content;
      if (content.nativeElement.offsetHeight > 200) {
        this.readMoreButton = true;
      }
    }
  }
  @ViewChild('imageUpload') fileInput?: ElementRef;
  @ViewChild('attachmentInput') attachmentInput?: ElementRef;
  @ViewChild('vote_create_form') voteCreateForm?: TopicVoteCreateComponent;

  languages$: { [key: string]: any } = this.config.get('language').list;
  titleLimit = 100;
  introLimit = 500;
  groups$: Observable<Group[] | any[]> = of([]);
  topicAttachments$ = of(<Attachment[] | any[]>[]);

  topicGroups = <Group[]>[];
  topic: Topic = <Topic>{
    title: null,
    intro: null,
    description: '',
    imageUrl: '',
    members: {
      users: <any[]>[],
      topics: <Topic[]>[]
    },
    visibility: this.TopicService.VISIBILITY.private,
    categories: <string[]>[]
  };

  public vote = {
    description: <string>'',
    topicId: <string>'',
    options: <any>[],
    delegationIsAllowed: false,
    type: '',
    authType: '',
    maxChoices: <number>1,
    minChoices: <number>1,
    reminderTime: <Date | null>null,
    autoClose: <any[]>[],
    endsAt: <Date | null>null
  };

  /*TODO - handle these below*/
  attachments = <any[]>[];
  tags = <any[]>[];
  showManageEditors = false;
  /**/
  VISIBILITY = this.TopicService.VISIBILITY;
  CATEGORIES = Object.keys(this.TopicService.CATEGORIES);
  languages = languages;
  countries = countries;
  errors?: any;
  tmpImageUrl?: string;
  imageFile?: any;
  tabSelected;
  showHelp = false;
  tabs = ['info', 'settings', 'voting_system', 'preview'];
  block = {
    attachments: false,
    headerImage: false,
    title: false,
    intro: false,
    description: false
  }

  members = <any[]>[];

  readMore = false;

  constructor(
    private app: AppService,
    public TopicService: TopicService,
    private Upload: UploadService,
    public translate: TranslateService,
    private Notification: NotificationService,
    public GroupService: GroupService,
    public GroupMemberTopicService: GroupMemberTopicService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private TopicAttachmentService: TopicAttachmentService,
    private TopicVoteService: TopicVoteService,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer,
    private config: ConfigService) {
    this.app.darkNav = true;
    this.groups$ = this.GroupService.loadItems();
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('info')
        }
        return fragment
      }
      ));
    // app.createNewTopic();
    this.route.params.pipe(
      map((params) => {
        if (params['topicId']) {
          return this.TopicService.get(params['topicId'])
        }
        return this.createTopic();
      })
      , take(1)
    ).subscribe({
      next: (topic) => {
        if (topic) {
          topic.pipe(take(1)).subscribe({
            next: (data) => {
              Object.assign(this.topic, data);
              this.topic.padUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.topic.padUrl);

              this.TopicAttachmentService.setParam('topicId', this.topic.id);
              this.topicAttachments$ = this.TopicAttachmentService.loadItems().pipe(
                map((attachments) => {
                  this.attachments = [];
                  attachments.forEach((item) => {
                    this.attachments.push(item);
                  })
                  return attachments;
                })
              );
            }
          })


        }
      }
    })
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
      if (tabIndex === 2) {
        if (this.voteCreateForm)
          this.voteCreateForm.saveVoteSettings();
      }
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

  deleteTopic() {
    /*this.TopicService.doDeleteTopic(topic, [this.Translate.currentLang, 'my', 'topics']);*/
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_DELETE_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.TOPIC_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.TOPIC_DELETE_CONFIRM_TXT_TOPIC_DELETED', 'MODALS.TOPIC_DELETE_CONFIRM_TXT_DISCUSSION_DELETED', 'MODALS.TOPIC_DELETE_CONFIRM_TXT_TOPIC_REMOVED_FROM_GROUPS'],
        confirmBtn: 'MODALS.TOPIC_DELETE_CONFIRM_YES',
        closeBtn: 'MODALS.TOPIC_DELETE_CONFIRM_NO'
      }
    });
    deleteDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.TopicService.delete(this.topic)
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate(['my', 'topics']);
          })
      }
    });
  };

  topicDownload() {
    return this.TopicService.download(this.topic.id);
  }

  chooseCategory(category: string) {
    if (this.topic.categories && this.topic.categories.indexOf(category) > -1) {
      this.topic.categories.splice(this.topic.categories.indexOf(category), 1);
    } else {
      this.topic.categories?.push(category);
    }
  }

  sanitizeURL() {
    return this.topic.padUrl;
  }
  createTopic() {
    this.topic.description = '<html><head></head><body></body></html>';
    this.TopicService.save(this.topic)
      .pipe(take(1))
      .subscribe({
        next: (topic: Topic) => {
          Object.assign(this.topic, topic);
          this.router.navigate([topic.id], { relativeTo: this.route });
        },
        error: (error: any) => {
          console.error('Vote create error: ',error);
        }
      })
    /*this.app.createNewTopic(this.topic.title, this.topic.visibility)
    .pipe(take(1))
    .subscribe({
      next: (topic:Topic) => {
      }
    })
    .unsubscribe();*/
  }

  triggerUpload() {
    this.attachmentInput?.nativeElement.click();
  };

  updateTopic() {
    return this.TopicService.patch(this.topic).pipe(take(1)).subscribe();
  }

  publish() {
    this.updateTopic();
    this.createVote();
  }

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
      if (attachment.size > 50000000) {
        this.Notification.addError('MSG_ERROR_ATTACHMENT_SIZE_OVER_LIMIT');
      } else if (this.Upload.ALLOWED_FILE_TYPES.indexOf(attachment.type.toLowerCase()) === -1) {
        const fileTypeError = this.translate.instant('MSG_ERROR_ATTACHMENT_TYPE_NOT_ALLOWED', { allowedFileTypes: this.Upload.ALLOWED_FILE_TYPES.toString() });
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
  }

  addTag(e: Event) {
    const tag = (e.target as HTMLInputElement).value;
    if (tag)
      this.tags.push(tag);
    (e.target as HTMLInputElement).value = '';
  }

  removeTag(tag: string) {
    this.tags.splice(this.tags.indexOf(tag), 1);
  }

  addGroup(group: Group) {
    this.topicGroups.push(group);
  }

  inviteMembers() {
    const inviteDialog = this.dialog.open(TopicInviteDialogComponent, { data: { topic: this.topic } });
    inviteDialog.afterClosed().subscribe({
      next: (inviteUsers) => {
        this.topic.members.users = inviteUsers;
        //   this.NotificationService.addSuccess('');
      },
      error: (error) => {
        // this.NotificationService.addError(error);
      }
    })
  }

  manageMembers() {
    const manageDialog = this.dialog.open(TopicParticipantsDialogComponent, { data: { topic: this.topic } });
    manageDialog.afterClosed().subscribe({
      next: (res) => {
      },
      error: (error) => {
        console.error('Manage members error:', error);
      }
    })
  }

  inviteEditors() {
    const inviteDialog = this.dialog.open(InviteEditorsComponent, { data: { topic: this.topic } });
    inviteDialog.afterClosed().subscribe({
      next: (inviteUsers) => {
        this.topic.members.users = inviteUsers;
      },
      error: (error) => {
        // this.NotificationService.addError(error);
      }
    })
  }

  saveVoteSettings(vote?: any) {
    if (vote) {
      this.vote = vote;
    }
  }

  createVote() {
    this.TopicVoteService.save(this.vote)
      .pipe(take(1))
      .subscribe({
        next: (vote) => {
          this.TopicService.reloadTopic();
          this.router.navigate(['/', this.translate.currentLang, 'topics', this.topic.id], {fragment: 'voting'});
          this.route.url.pipe(take(1)).subscribe();
        },
        error: (res) => {
          console.debug('createVote() ERR', res, res.errors, this.vote.options);
          this.errors = res.errors;
          Object.values(this.errors).forEach((message) => {
            if (typeof message === 'string')
              this.Notification.addError(message);
          });
        }
      });
  }

  cancel() {
    const confirmDialog = this.dialog.open(InterruptDialogComponent);

    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        /*this.TopicService.delete({ id: this.topic.id })
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate(['dashboard']);
          })*/
        this.router.navigate(['dashboard']);
      }
    });
    //[routerLink]="['/', translate.currentLang, 'topics', topic.id]"
  }
}
