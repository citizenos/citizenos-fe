import { trigger, state, style } from '@angular/animations';
import { Component, ElementRef, Inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, map, tap, Observable, take, switchMap, takeWhile, BehaviorSubject } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { ConfigService } from 'src/app/services/config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicService } from 'src/app/services/topic.service';
import { UploadService } from 'src/app/services/upload.service';
import { GroupService } from 'src/app/services/group.service';
import { Group, TopicMemberGroup } from 'src/app/interfaces/group';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
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
import { Attachment } from 'src/app/interfaces/attachment';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { TopicFormComponent } from 'src/app/topic/components/topic-form/topic-form.component';
import { BlockNavigationIfChange } from 'src/app/shared/pending-changes.guard';

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
export class VoteCreateComponent extends TopicFormComponent implements BlockNavigationIfChange {
  @ViewChild('vote_create_form') voteCreateForm?: TopicVoteCreateComponent;

  languages$: { [key: string]: any } = this.config.get('language').list;
  topic$: Observable<Topic>;
  hasChanges$ = new BehaviorSubject(<boolean>true);

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

  /**/
  errors?: any;
  override tabs = ['info', 'settings', 'voting_system', 'preview'];
  members = <any[]>[];
  constructor(
    dialog: DialogService,
    route: ActivatedRoute,
    router: Router,
    UploadService: UploadService,
    Notification: NotificationService,
    TopicService: TopicService,
    GroupService: GroupService,
    GroupMemberTopicService: GroupMemberTopicService,
    TopicMemberGroupService: TopicMemberGroupService,
    TopicMemberUserService: TopicMemberUserService,
    TopicInviteUserService: TopicInviteUserService,
    TopicAttachmentService: TopicAttachmentService,
    translate: TranslateService,
    cd: ChangeDetectorRef,
    @Inject(DomSanitizer) override sanitizer: DomSanitizer,
    private app: AppService,
    private TopicVoteService: TopicVoteService,
    private config: ConfigService) {
    super(dialog, route, router, UploadService, Notification, TopicService, GroupService, GroupMemberTopicService, TopicMemberGroupService, TopicMemberUserService, TopicInviteUserService, TopicAttachmentService, translate, cd, sanitizer)
    this.app.darkNav = true;
    this.groups$ = this.GroupService.loadItems();
    this.tabSelected = route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('info');
        }
        return fragment
      }), tap((fragment) => {
        if (fragment === 'info' && !this.TopicService.canEditDescription(<Topic>this.topic)) {
          const infoDialog = dialog.open(TopicEditDisabledDialogComponent);
          infoDialog.afterClosed().subscribe(() => {
            this.selectTab('settings')
          });
        }
      }));
    // app.createNewTopic();
    if (router.url.indexOf('/edit/') > -1) {
      this.isnew = false;
    }
    this.topic$ = route.params.pipe(
      switchMap((params) => {
        if (params['topicId']) {
          return this.TopicService.loadTopic(params['topicId']).pipe(map((topic) => {
            this.topicUrl = this.sanitizer.bypassSecurityTrustResourceUrl(topic.padUrl);
            this.topic = topic;
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

              TopicAttachmentService.setParam('topicId', this.topic.id);
              this.topicAttachments$ = TopicAttachmentService.loadItems();
              this.TopicMemberGroupService.setParam('topicId', this.topic.id);
              this.topicGroups$ = this.TopicMemberGroupService.loadItems().pipe(
                tap((groups) => {
                  if (groups.length && this.isnew) {
                    this.topic.visibility = groups[0].visibility;
                    this.isCreatedFromGroup = true;
                  }
                  groups.forEach((group: any) => {
                    const exists = this.topicGroups.find((mgroup) => mgroup.id === group.id);
                    if (!exists) this.topicGroups.push(group);
                  })
                })
              );
            }
            if (topic.voteId) {
              setTimeout(() => {
                this.TopicVoteService.get({ topicId: topic.id, voteId: topic.voteId }).pipe(take(1)).subscribe({
                  next: (vote) => {
                    this.vote = vote;
                    this.vote.options = vote.options.rows;
                    this.vote.options.forEach((option) => {
                      option.enabled = true;
                    });
                    cd.detectChanges();
                  }
                });
              });
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
  override ngOnInit(): void {

  }
  override nextTab(tab: string | void) {
    if (tab) {
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
      const tabIndex = this.tabs.indexOf(tab);
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
        /*  if (this.voteCreateForm)
            this.voteCreateForm.saveVoteSettings();*/
      }
      if (tabIndex + 1 === 3) {
        this.voteCreateForm?.filterOptions();
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
      if (tabIndex > -1 && tabIndex < 3) {
        setTimeout(() => {
          this.selectTab(this.tabs[tabIndex + 1]);
        })
      }
    }
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

  override saveAsDraft() {
    if (this.topic.status === this.TopicService.STATUSES.draft) {
      const updateTopic = Object.assign({}, this.topic);
      if (!updateTopic.intro?.length) {
        updateTopic.intro = null;
      }

      this.TopicService.patch(updateTopic).pipe(take(1)).subscribe(() => {
        if (!this.vote.id) {
          this.createVote();
        } else {
          this.updateVote();
        }
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

              this.hasChanges$.next(false);
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

  override publish() {
    this.titleInput?.nativeElement?.parentNode.parentNode.classList.remove('error');
    const isDraft = (this.topic.status === this.TopicService.STATUSES.draft);
    const updateTopic = Object.assign({}, this.topic);
    if (!updateTopic.intro?.length) {
      updateTopic.intro = null;
    }

    this.TopicService.patch(updateTopic).pipe(take(1)).subscribe({
      next: () => {
        console.log('SAVED');
        this.TopicService.reloadTopic();
        this.saveImage()
          .subscribe({
            next: (res: any) => {
              if (res && !res.link) return;

              this.topicGroups.forEach((group) => {
                this.saveMemberGroup(group)
              });
              if (!this.vote.id) {
                this.createVote();
              } else {
                this.updateVote();
              }
              updateTopic.status = this.TopicService.STATUSES.voting;
              this.TopicService.patch(updateTopic).pipe(take(1)).subscribe({
                next: (res) => {
                  this.hasChanges$.next(false);
                  this.router.navigate(['/', this.translate.currentLang, 'topics', this.topic.id]);
                  this.TopicService.reloadTopic();
                  if (this.isnew || isDraft) {
                    this.Notification.addSuccess('VIEWS.TOPIC_CREATE.NOTIFICATION_SUCCESS_MESSAGE', 'VIEWS.TOPIC_CREATE.NOTIFICATION_SUCCESS_TITLE');
                    this.inviteMembers();
                  } else {
                    this.Notification.addSuccess('VIEWS.TOPIC_EDIT.NOTIFICATION_SUCCESS_MESSAGE', 'VIEWS.TOPIC_EDIT.NOTIFICATION_SUCCESS_TITLE');
                  }
                },
                error: (err) => {
                  console.log('Update status error', err);
                }
              });
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


  updateVote() {
    const updateVote = Object.assign({ topicId: this.topic.id }, this.vote);
    const options = updateVote.options.map((opt) => {
      return { value: opt.value, voteId: opt.voteId, id: opt.id };
    })
    updateVote.options = options;
    return this.TopicVoteService.update(updateVote).pipe(take(1)).subscribe();
  }

  removeChanges() {
    console.log(this.topic)
    this.TopicService.revert(this.topic.id, this.topic.revision!).pipe(take(1)).subscribe();
  }

}
