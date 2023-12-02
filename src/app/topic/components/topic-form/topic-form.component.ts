import { trigger, state, style } from '@angular/animations';
import { Component, Inject, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, take, BehaviorSubject, Observable, takeWhile } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/group.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Group } from 'src/app/interfaces/group';
import { TranslateService } from '@ngx-translate/core';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { TopicParticipantsDialogComponent } from '../topic-participants/topic-participants.component';
import { InviteEditorsComponent } from '../invite-editors/invite-editors.component';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicInviteDialogComponent } from '../topic-invite/topic-invite.component';
import { countries } from 'src/app/services/country.service';
import { languages } from 'src/app/services/language.service';
import { InterruptDialogComponent } from 'src/app/shared/components/interrupt-dialog/interrupt-dialog.component';
import { UploadService } from 'src/app/services/upload.service';
@Component({
  selector: 'topic-form',
  templateUrl: './topic-form.component.html',
  styleUrls: ['./topic-form.component.scss'],
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
export class TopicFormComponent {
  topicText?: ElementRef
  readMoreButton = new BehaviorSubject(false);
  @ViewChild('topicText') set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
      this.topicText = content;
      if (content.nativeElement.offsetHeight > 200) {
        this.readMoreButton.next(true);
      }
      this.cd.detectChanges();
    }
  }
  @ViewChild('imageUpload') fileInput?: ElementRef;
  @Input() topic!: Topic;
  @Input() isnew?: boolean = true;
  topicUrl = <SafeResourceUrl>'';
  tabSelected;
  tabs = ['info', 'settings', 'preview'];

  tags = <string[]>[];
  showManageEditors = false;
  block = {
    attachments: false,
    headerImage: false,
    title: false,
    intro: false,
    description: false
  }

  titleLimit = 100;
  introLimit = 500;

  tmpImageUrl?: string;
  imageFile?: any;

  VISIBILITY = this.TopicService.VISIBILITY;
  CATEGORIES = Object.keys(this.TopicService.CATEGORIES);
  groups$: Observable<Group[] | any[]> = of([]);
  topicGroups = <Group[]>[];

  readMore = false;

  showHelp = false;
  languages = languages;
  countries = countries;
  downloadUrl = '';
  error:any;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private UploadService: UploadService,
    private Notification: NotificationService,
    public TopicService: TopicService,
    public GroupService: GroupService,
    public TopicMemberGroupService: TopicMemberGroupService,
    public translate: TranslateService,
    private cd: ChangeDetectorRef,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer
  ) {
    this.groups$ = this.GroupService.loadItems();
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('info')
        }
        return fragment
      }
      ));
  }

  ngOnInit() {
    this.topicUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.topic.padUrl);
    this.downloadUrl = this.TopicService.download(this.topic.id);
    console.log(this.topic);
    Object.keys(this.block).forEach((blockname) => {
      const temp = this.topic[blockname as keyof Topic];
      if (temp)
        this.block[blockname as keyof typeof this.block] = true;
    });
  }

  sanitizeURL(): SafeResourceUrl {
    return this.topicUrl;
  }

  selectTab(tab: string) {
    this.router.navigate([], { fragment: tab });
  }

  nextTab(tab: string | void) {
    this.updateTopic();
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > -1 && tabIndex < 2) {
        this.selectTab(this.tabs[tabIndex + 1]);
      }
      if (tabIndex+1 === 2) {
        setTimeout(() => {
          this.TopicService.reloadTopic();
        })
      }
    }
  }

  previousTab(tab: string | void) {
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > 0) {
        this.selectTab(this.tabs[tabIndex - 1]);
      }
    }
  }

  saveImage() {
    if (this.imageFile) {
      this.UploadService
        .uploadTopicImage({topicId: this.topic.id}, this.imageFile).pipe(
          takeWhile((res: any) => {
            return (!res.link)
          }, true)
        )
        .subscribe({
          next: (res: any) => {
            if (res.link) {
              this.topic.imageUrl = res.link;
            }
          },
          error: (err: any) => {
            console.log('ERROR', err);
          }
        });
    }
  }

  fileUpload() {
    const allowedTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];
    const files = this.fileInput?.nativeElement.files;
    if (allowedTypes.indexOf(files[0].type) < 0) {
      this.error = {image: this.translate.instant('MSG_ERROR_FILE_TYPE_NOT_ALLOWED', {allowedFileTypes: allowedTypes.toString()})};
      setTimeout(() => {
        delete this.error.image;
      }, 5000)
    } else if (files[0].size  > 5000000) {
      this.error = {image: this.translate.instant('MSG_ERROR_FILE_TOO_LARGE', {allowedFileSize: '5MB'})};

      setTimeout(() => {
        delete this.error.image;
      }, 5000)
    } else {
      this.imageFile = files[0];
      return this.saveImage();
    }
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
    this.saveImage();
  }

  uploadImage() {
    this.fileInput?.nativeElement.click();
  };

  deleteTopicImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }
    if (this.topic.imageUrl) {
      this.topic.imageUrl = null;
      this.tmpImageUrl = undefined;
      this.updateTopic();
    }
  };

  deleteTopic(topicId: string) {
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
        this.TopicService.delete({ id: topicId })
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate(['my', 'topics']);
          })
      }
    });
  };

  updateTopic() {
    return this.TopicService.patch(this.topic).pipe(take(1)).subscribe();
  }

  publish() {
    this.updateTopic();
    this.topicGroups.forEach((group) => {
      this.TopicMemberGroupService.save({
        groupId: group.id,
        topicId: this.topic.id,
        level: group.permission?.level || this.TopicMemberGroupService.LEVELS.read
      }).pipe(take(1)).subscribe();
    });
    this.TopicService.reloadTopic();
    this.router.navigate(['/', this.translate.currentLang, 'topics', this.topic.id]);

    if (this.isnew) {
      this.Notification.addSuccess('VIEWS.TOPIC_CREATE.NOTIFICATION_SUCCESS_MESSAGE', 'VIEWS.TOPIC_CREATE.NOTIFICATION_SUCCESS_TITLE');
      this.inviteMembers();
    }
  }

  chooseCategory(category: string) {
    if (this.topic.categories && this.topic.categories.indexOf(category) > -1) {
      this.topic.categories.splice(this.topic.categories.indexOf(category), 1);
    } else {
      this.topic.categories?.push(category);
    }
  }

  addGroup(group: Group) {
    this.topicGroups.push(group);
  }


  manageMembers() {
    const manageDialog = this.dialog.open(TopicParticipantsDialogComponent, { data: { topic: this.topic } });
    manageDialog.afterClosed().subscribe({
      next: (res) => {
      },
      error: (error) => {
        console.error('ERROR MANAGE MEMBERS', error);
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

  inviteMembers() {
    const inviteDialog = this.dialog.open(TopicInviteDialogComponent, { data: { topic: this.topic } });
    inviteDialog.afterClosed().subscribe({
      next: (inviteUsers) => {
      },
      error: (error) => {
      }
    })
  }

  setCountry(country: string) {
    this.topic.country = country;
    this.updateTopic();
  }
  setLanguage(language: string) {
    this.topic.language = language;
    this.updateTopic();
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

  setGroupLevel(group: Group, level: string) {
    if (!group.permission) group.permission = {level};
    group.permission.level = level;
  }
}
