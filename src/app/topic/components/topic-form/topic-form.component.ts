import { trigger, state, style } from '@angular/animations';
import { Component, Inject, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap, of, take, BehaviorSubject, Observable, takeWhile, switchMap } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { DialogService } from 'src/app/shared/dialog';
import { GroupService } from 'src/app/services/group.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Group } from 'src/app/interfaces/group';
import { TranslateService } from '@ngx-translate/core';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { TopicParticipantsDialogComponent } from '../topic-participants/topic-participants.component';
import { InviteEditorsComponent } from '../invite-editors/invite-editors.component';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicInviteDialogComponent } from '../topic-invite/topic-invite.component';
import { countries } from 'src/app/services/country.service';
import { languages } from 'src/app/services/language.service';
import { InterruptDialogComponent } from 'src/app/shared/components/interrupt-dialog/interrupt-dialog.component';
import { UploadService } from 'src/app/services/upload.service';
import { TopicSettingsDisabledDialogComponent } from '../topic-settings-disabled-dialog/topic-settings-disabled-dialog.component';
import { Attachment } from 'src/app/interfaces/attachment';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';

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
  @ViewChild('topicTitle') titleInput!: ElementRef;
  @ViewChild('topicIntro') introInput!: ElementRef;
  @ViewChild('topicText') set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
      this.topicText = content;
      if (content.nativeElement.offsetHeight >= 320) {
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
  private loadMembers$ = new BehaviorSubject<void>(undefined);
  members$: Observable<any[] | any[]> = of([]);
  private loadInvite$ = new BehaviorSubject<void>(undefined);
  invites$: Observable<any[]> = of([]);
  topicGroups = <Group[]>[];

  readMore = false;

  showHelp = false;
  languages = languages.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });
  countries = countries.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });
  downloadUrl = '';
  error: any;

  showCategories = false;
  showAttachments = false;
  showGroups = false;
  topicAttachments$ = of(<Attachment[] | any[]>[]);
  topicGroups$ = of(<Group[] | any[]>[])

  constructor(
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private UploadService: UploadService,
    private Notification: NotificationService,
    public TopicService: TopicService,
    public GroupService: GroupService,
    public TopicMemberGroupService: TopicMemberGroupService,
    public TopicMemberUserService: TopicMemberUserService,
    public TopicInviteUserService: TopicInviteUserService,
    private TopicAttachmentService: TopicAttachmentService,
    public translate: TranslateService,
    private cd: ChangeDetectorRef,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer
  ) {
    this.groups$ = this.GroupService.loadItems().pipe(
      map((groups) => {
        return groups.filter((g) => g.permission.level === this.TopicMemberGroupService.LEVELS.admin);
      })
    );
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('info')
        }
        return fragment
      }
      ), tap((fragment) => {
        if (fragment === 'settings' && !this.TopicService.canDelete(<Topic>this.topic)) {
          const infoDialog = this.dialog.open(TopicSettingsDisabledDialogComponent);
          infoDialog.afterClosed().subscribe(() => {
            this.selectTab('info')
          });
        }
      }));
  }

  ngOnInit() {
    this.topicUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.topic.padUrl);
    this.downloadUrl = this.TopicService.download(this.topic.id);
    Object.keys(this.block).forEach((blockname) => {
      const temp = this.topic[blockname as keyof Topic];
      if (blockname === 'description') {
        const el = document.createElement('span');
        el.innerHTML = temp;
        if (el.innerText)
          this.block['description'] = true;
      } else if (temp)
        this.block[blockname as keyof typeof this.block] = true;
    });
    if (this.topic.id) {
      this.TopicInviteUserService.setParam('topicId', this.topic.id);
      this.invites$ = this.loadInvite$.pipe(
        switchMap(() => this.TopicInviteUserService.loadItems())
      );
      this.TopicMemberUserService.setParam('topicId', this.topic.id);
      this.members$ = this.loadMembers$.pipe(
        switchMap(() => this.TopicMemberUserService.loadItems()),
        tap((members) => {
          this.topic.members.users = members;
          return members;
        })
      );
      this.TopicAttachmentService.setParam('topicId', this.topic.id);
      this.topicAttachments$ = this.TopicAttachmentService.loadItems();
      this.TopicMemberGroupService.setParam('topicId', this.topic.id);
      this.topicGroups$ = this.TopicMemberGroupService.loadItems().pipe(
        tap((groups) => {
          groups.forEach((group) => {
            const exists = this.topicGroups.find((mgroup) => mgroup.id === group.id);
            if (!exists) this.topicGroups.push(group);
          })
        })
      );
    }
  }

  sanitizeURL(): SafeResourceUrl {
    return this.topicUrl;
  }

  selectTab(tab: string) {
    this.router.navigate([], { fragment: tab });
  }

  nextTab(tab: string | void) {
    window.scrollTo(0, 0);
    this.updateTopic();
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > -1 && tabIndex < 2) {
        this.selectTab(this.tabs[tabIndex + 1]);
      }
      if (tabIndex + 1 === 2) {
        setTimeout(() => {
          this.TopicService.reloadTopic();
        }, 200)
      }
    }
  }

  previousTab(tab: string | void) {
    window.scrollTo(0, 0);
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
        .uploadTopicImage({ topicId: this.topic.id }, this.imageFile).pipe(
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
      this.error = { image: this.translate.instant('MSG_ERROR_FILE_TYPE_NOT_ALLOWED', { allowedFileTypes: allowedTypes.toString() }) };
      setTimeout(() => {
        delete this.error.image;
      }, 5000)
    } else if (files[0].size > 5000000) {
      this.error = { image: this.translate.instant('MSG_ERROR_FILE_TOO_LARGE', { allowedFileSize: '5MB' }) };

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

  showBlockTitle() {
    this.block.title = true;
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    }, 200);
  }

  showBlockIntro() {
    this.block.intro = true;
    setTimeout(() => {
      console.log(this.introInput)
      this.introInput.nativeElement.focus();
    }, 200);
  }

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
    return this.TopicService.patch(this.topic).pipe(take(1)).subscribe(() => this.TopicService.reloadTopic());
  }

  saveAsDraft() {
    if (this.topic.status === this.TopicService.STATUSES.draft) {
      this.TopicService.patch(this.topic).pipe(take(1)).subscribe({
        next: () => {
          this.router.navigate(['my', 'topics']);
        }
      });
    }
  }
  publish() {
    this.topic.status = this.TopicService.STATUSES.inProgress;
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
    } else {
      this.Notification.addSuccess('VIEWS.TOPIC_EDIT.NOTIFICATION_SUCCESS_MESSAGE', 'VIEWS.TOPIC_EDIT.NOTIFICATION_SUCCESS_TITLE');
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

  removeGroup(group: Group) {
    const index = this.topicGroups.findIndex((tg) => tg.id === group.id);
    this.topicGroups.splice(index, 1);
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
        this.loadInvite$.next();
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
        this.loadInvite$.next();
        this.Notification.removeAll();
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
    if (!group.permission) group.permission = { level };
    group.permission.level = level;
  }

  isGroupAdded(group: Group) {
    return this.topicGroups.find((tg: Group) => tg.id === group.id);
  }
}
