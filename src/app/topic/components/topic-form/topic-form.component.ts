import { trigger, state, style } from '@angular/animations';
import { Component, Inject, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap, of, take, BehaviorSubject, Observable, takeWhile, switchMap, Subject } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { DialogService } from 'src/app/shared/dialog';
import { GroupService } from 'src/app/services/group.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Group, TopicMemberGroup } from 'src/app/interfaces/group';
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
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';

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
  isCreatedFromGroup = false;
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
  @Input() groupId?: string;
  @Input() isnew?: boolean = true;
  @Input() hasUnsavedChanges!: Subject<boolean>;
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
  groups$: Observable<TopicMemberGroup[] | any[]> = of([]);
  loadMembers$ = new BehaviorSubject<void>(undefined);
  members$: Observable<any[] | any[]> = of([]);
  loadInvite$ = new BehaviorSubject<void>(undefined);
  invites$: Observable<any[]> = of([]);
  topicGroups = <TopicMemberGroup[]>[];

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
  topicGroups$ = of(<TopicMemberGroup[] | any[]>[])
  memberGroups = <TopicMemberGroup[]>[];
  constructor(
    public dialog: DialogService,
    public route: ActivatedRoute,
    public router: Router,
    public UploadService: UploadService,
    public Notification: NotificationService,
    public TopicService: TopicService,
    public GroupService: GroupService,
    public GroupMemberTopicService: GroupMemberTopicService,
    public TopicMemberGroupService: TopicMemberGroupService,
    public TopicMemberUserService: TopicMemberUserService,
    public TopicInviteUserService: TopicInviteUserService,
    public TopicAttachmentService: TopicAttachmentService,
    public translate: TranslateService,
    public cd: ChangeDetectorRef,
    @Inject(DomSanitizer) public sanitizer: DomSanitizer
  ) {
    this.groups$ = this.GroupService.loadItems().pipe(tap((groups) => {
      groups.forEach((group: any) => {
        if (this.groupId && this.groupId === group.id) {
          const exists = this.topicGroups.find((mgroup) => mgroup.id === group.id);
          if (!exists) this.addGroup(group);
        }
      })
    }));
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
    this.hasUnsavedChanges.next(true);
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
          groups.forEach((group: any) => {
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


  isNextDisabled(tabSelected: string | void) {
    if (tabSelected === 'preview' && !this.TopicService.canDelete(this.topic)) {
      return true;
    } else if (!this.topic.title || !this.topic.description) {
      return true;
    }

    return false;
  }

  nextTab(tab: string | void) {
    if (tab === 'info') {
      let invalid = false;
      if (!this.topic.title) {
        this.block.title = true;
        invalid = true;
        setTimeout(() => {
          this.titleInput?.nativeElement?.parentNode.parentNode.classList.add('error');
        });
      }
      if (invalid) {
        return
      }
    }
    window.scrollTo(0, 0);
    if (tab) {
      let tabIndex = this.tabs.indexOf(tab);
      if (tab === 'info' && this.topic.permission.level === this.TopicService.LEVELS.edit) tabIndex = tabIndex + 1;
      if (tabIndex > -1 && tabIndex < 2) {
        this.selectTab(this.tabs[tabIndex + 1]);
      }
      if (tabIndex + 1 === 2) {
        setTimeout(() => {
          this.TopicService.readDescription(this.topic.id).pipe(take(1)).subscribe({
            next: (topic) => {
              this.topic.description = topic.description;
            },
            error: (err) => {
              console.error(err)
            }
          });
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
      return this.UploadService
        .uploadTopicImage({ topicId: this.topic.id }, this.imageFile).pipe(
          takeWhile((res: any) => {
            return (!res.link)
          }, true)
        );
    }
    return of(false);
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
      const reader = new FileReader();
      reader.onload = (() => {
        return (e: any) => {
          this.tmpImageUrl = e.target.result;
        };
      })();
      reader.readAsDataURL(files[0]);
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

  saveAsDraft() {
    if (this.topic.status === this.TopicService.STATUSES.draft) {
      const updateTopic = Object.assign({}, this.topic);
      if (!updateTopic.intro?.length) {
        updateTopic.intro = null;
      }

      this.TopicService.patch(updateTopic).pipe(take(1)).subscribe(() => {
        this.topicGroups.forEach((group) => {
          this.saveMemberGroup(group);
        });
        this.saveImage()
          .subscribe({
            next: (res: any) => {
              if (res && !res.link) return;
              if (res.link) {
                this.topic.imageUrl = res.link;
              }
              this.hasUnsavedChanges.next(false);
              this.router.navigate(['my', 'topics']);
              this.Notification.addSuccess('VIEWS.TOPIC_EDIT.NOTIFICATION_SUCCESS_MESSAGE', 'VIEWS.TOPIC_EDIT.NOTIFICATION_SUCCESS_TITLE');
            },
            error: (err: any) => {
              console.log('ERROR', err);
            }
          });

      });
    }
  }

  saveMemberGroup(group: any) {
    this.GroupMemberTopicService.save({
      groupId: group.id,
      topicId: this.topic.id,
      level: group.level || this.GroupMemberTopicService.LEVELS.read
    }).pipe(take(1)).subscribe();
  }

  publish() {
    console.log('PUBLSIH')
    this.titleInput?.nativeElement?.parentNode.parentNode.classList.remove('error');
    const isDraft = (this.topic.status === this.TopicService.STATUSES.draft);
    this.topic.status = this.TopicService.STATUSES.inProgress;
    const updateTopic = Object.assign({}, this.topic);
    if (!updateTopic.intro?.length) {
      updateTopic.intro = null;
    }

    this.TopicService.patch(updateTopic).pipe(take(1)).subscribe({
      next: () => {
        this.TopicService.reloadTopic();
        this.saveImage()
          .subscribe({
            next: (res: any) => {
              if (res && !res.link) return;

              this.topicGroups.forEach((group) => {
                this.saveMemberGroup(group)
              });
              this.hasUnsavedChanges.next(false);
              this.router.navigate(['/', this.translate.currentLang, 'topics', this.topic.id]);

              if (this.isnew || isDraft) {
                this.Notification.addSuccess('VIEWS.TOPIC_CREATE.NOTIFICATION_SUCCESS_MESSAGE', 'VIEWS.TOPIC_CREATE.NOTIFICATION_SUCCESS_TITLE');
                this.inviteMembers();
              } else {
                this.Notification.addSuccess('VIEWS.TOPIC_EDIT.NOTIFICATION_SUCCESS_MESSAGE', 'VIEWS.TOPIC_EDIT.NOTIFICATION_SUCCESS_TITLE');
              }
            },
            error: (err) => {
              console.log('publish error', err)
            }
          });
      },
      error: (err: any) => {
        console.log('ERROR', err);
      }
    });
  }


  chooseCategory(category: string) {
    if (this.topic.categories && this.topic.categories.indexOf(category) > -1) {
      this.topic.categories.splice(this.topic.categories.indexOf(category), 1);
    } else if (this.topic.categories.length < 3) {
      this.topic.categories?.push(category);
    }
  }

  addGroup(group: TopicMemberGroup) {
    const exists = this.topicGroups.find((mgroup) => mgroup.id === group.id);
    if (!exists) {
      group.level = this.GroupMemberTopicService.LEVELS.read;
      this.topicGroups.push(group);
    }
  }

  removeGroup(group: TopicMemberGroup) {
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
  }
  setLanguage(language: string) {
    this.topic.language = language;
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
    if (this.isnew || this.topic.status === this.TopicService.STATUSES.draft) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['topics', this.topic.id]);
    }
  }

  setGroupLevel(group: TopicMemberGroup, level: string) {
    if (!group.level) group.level = level;
    group.level = level;
  }

  isGroupAdded(group: TopicMemberGroup) {
    return this.topicGroups.find((tg: TopicMemberGroup) => tg.id === group.id);
  }
}
