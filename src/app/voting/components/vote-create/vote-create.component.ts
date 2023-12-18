import { trigger, state, style } from '@angular/animations';
import { Component, ElementRef, Inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, map, tap, Observable, take, switchMap, takeWhile } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { ConfigService } from 'src/app/services/config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicService } from 'src/app/services/topic.service';
import { UploadService } from 'src/app/services/upload.service';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { TopicInviteDialogComponent } from 'src/app/topic/components/topic-invite/topic-invite.component';
import { TopicParticipantsDialogComponent } from 'src/app/topic/components/topic-participants/topic-participants.component';
import { InviteEditorsComponent } from 'src/app/topic/components/invite-editors/invite-editors.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TopicVoteCreateComponent } from 'src/app/topic/components/topic-vote-create/topic-vote-create.component';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { countries } from 'src/app/services/country.service';
import { languages } from 'src/app/services/language.service';
import { InterruptDialogComponent } from 'src/app/shared/components/interrupt-dialog/interrupt-dialog.component';
import { TopicEditDisabledDialogComponent } from 'src/app/topic/components/topic-edit-disabled-dialog/topic-edit-disabled-dialog.component';

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
  invites$: Observable<any[]> = of([]);

  topicGroups = <Group[]>[];
  topic$: Observable<Topic>;
  topic: any;
  public vote = {
    createdAt: '',
    id: '',
    reminderSent: null,
    votersCount: 0,
    description: '',
    options: <any[]>[],
    delegationIsAllowed: false,
    type: '',
    authType: '',
    maxChoices: <number>1,
    minChoices: <number>1,
    reminderTime: null,
    autoClose: [{
      value: 'allMembersVoted',
      enabled: false
    }],
    endsAt: null
  };

  /*TODO - handle these below*/
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
    headerImage: false,
    title: false,
    intro: false,
    description: false
  }

  members = <any[]>[];

  readMore = false;
  isnew = true;

  constructor(
    private app: AppService,
    private cd: ChangeDetectorRef,
    public TopicService: TopicService,
    private Upload: UploadService,
    public translate: TranslateService,
    private Notification: NotificationService,
    public GroupService: GroupService,
    public GroupMemberTopicService: GroupMemberTopicService,
    public TopicInviteUserService: TopicInviteUserService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private TopicVoteService: TopicVoteService,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer,
    private config: ConfigService) {
    this.app.darkNav = true;
    this.groups$ = this.GroupService.loadItems();
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('info');
        }
        return fragment
      }), tap((fragment) => {
        if (fragment === 'info' && !this.TopicService.canEditDescription(<Topic>this.topic)) {
          const infoDialog = this.dialog.open(TopicEditDisabledDialogComponent);
          infoDialog.afterClosed().subscribe(() => {
            this.selectTab('settings')
          });
        }
      }));
    // app.createNewTopic();
    if (this.router.url.indexOf('/edit/') > -1) {
      this.isnew = false;
    }
    this.topic$ = this.route.params.pipe(
      switchMap((params) => {
        if (params['topicId']) {
          return this.TopicService.loadTopic(params['topicId']).pipe(map((topic) => {
            topic.padUrl = this.sanitizer.bypassSecurityTrustResourceUrl(topic.padUrl);
            this.topic = topic;
            if (topic.voteId) {
              this.TopicVoteService.get({ topicId: topic.id, voteId: topic.voteId }).pipe(take(1)).subscribe({
                next: (vote) => {
                  this.vote = vote;
                  this.vote.options = vote.options.rows;
                  this.vote.options.forEach((option) => {
                    option.enabled = true;
                  });
                  this.cd.detectChanges();
                }
              })
            }
            return topic;
          }));
        }
        return this.createTopic();
      })
    );
    /*
        this.route.params.pipe(
          map((params) => {
            if (params['topicId']) {
              return this.TopicService.loadTopic(params['topicId'])
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
                }
              })


            }
          }
        })*/
  }
  ngOnInit(): void {
    if (this.topic.id) {
      this.TopicInviteUserService.setParam('topicId', this.topic.id);
      this.invites$ = this.TopicInviteUserService.loadItems();
    }
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
      if (tabIndex === 1) {
        this.updateTopic();
      }

      if (tabIndex === 2) {
        if (!this.vote.description) {
          this.Notification.removeAll();
          this.Notification.addError('VIEWS.VOTE_CREATE.ERROR_MISSING_QUESTION');
          return;
        } else if (this.vote.options.length < 2) {
          this.Notification.removeAll();
          this.Notification.addError('VIEWS.VOTE_CREATE.ERROR_AT_LEAST_TWO_OPTIONS_REQUIRED');
          return;
        }
        if (!this.vote.id) {
          this.createVote();
        } else {
          this.updateVote();
        }
        /*  if (this.voteCreateForm)
            this.voteCreateForm.saveVoteSettings();*/
      }
      if (tabIndex + 1 === 3) {
        //     this.TopicService.reloadTopic();
      }
      if (tabIndex > -1 && tabIndex < 3) {
        this.selectTab(this.tabs[tabIndex + 1]);
      }
    }
  }

  saveImage() {
    if (this.imageFile) {
      this.Upload
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
      this.errors = { image: this.translate.instant('MSG_ERROR_FILE_TYPE_NOT_ALLOWED', { allowedFileTypes: allowedTypes.toString() }) };
      setTimeout(() => {
        delete this.errors.image;
      }, 5000)
    } else if (files[0].size > 5000000) {
      this.errors = { image: this.translate.instant('MSG_ERROR_FILE_TOO_LARGE', { allowedFileSize: '5MB' }) };

      setTimeout(() => {
        delete this.errors.image;
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
    const topic = {
      description: '<html><head></head><body></body></html>',
      visbility: this.TopicService.VISIBILITY.private
    };

    return this.TopicService.save(topic)
      .pipe(take(1),
        tap((topic: Topic) => {
          this.router.navigate([topic.id], { relativeTo: this.route });
        }));
  }

  triggerUpload() {
    this.attachmentInput?.nativeElement.click();
  };

  setCountry(country: string) {
    this.topic.country = country;
    this.updateTopic();
  }
  setLanguage(language: string) {
    this.topic.language = language;
    this.updateTopic();
  }

  updateTopic() {
    return this.TopicService.patch(this.topic).pipe(take(1)).subscribe();
  }
  updateVote() {
    const updateVote = Object.assign({ topicId: this.topic.id }, this.vote);
    const options = updateVote.options.map((opt) => {
      return {value: opt.value, voteId: opt.voteId, id: opt.id};
    })
    updateVote.options = options;
    return this.TopicVoteService.update(updateVote).pipe(take(1)).subscribe();
  }

  saveAsDraft() {
    this.updateTopic();
    this.updateVote();
    this.router.navigate(['my', 'topics']);
  }
  publish() {
    this.updateTopic();
    this.topicGroups.forEach((group) => {
      this.GroupMemberTopicService.save({
        groupId: group.id,
        topicId: this.topic.id,
        level: group.permission?.level || this.GroupMemberTopicService.LEVELS.read
      }).pipe(take(1)).subscribe();
    });
    this.updateVote();
    this.topic.status = this.TopicService.STATUSES.voting;
    this.updateTopic();
    this.TopicService.reloadTopic();
    this.router.navigate(['topics', this.topic.id], {fragment: 'voting'});
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
    const createVote: any = Object.assign({ topicId: this.topic.id }, this.vote);
    this.TopicVoteService.save(createVote)
      .pipe(take(1))
      .subscribe({
        next: (vote) => {
          //   this.TopicService.reloadTopic();
          this.vote = vote;
          this.vote.options = vote.options.rows;
          //     this.router.navigate(['/', this.translate.currentLang, 'topics', this.topic.id], { fragment: 'voting' });
          //      this.route.url.pipe(take(1)).subscribe();
        },
        error: (res) => {
          this.nextTab('voting_system');
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

  setGroupLevel(group: Group, level: string) {
    if (!group.permission) group.permission = { level };
    group.permission.level = level;
  }
}
