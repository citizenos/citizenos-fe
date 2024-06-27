import { trigger, state, style } from '@angular/animations';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, tap, Observable, take, switchMap, BehaviorSubject, Subject } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { ConfigService } from 'src/app/services/config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicService } from 'src/app/services/topic.service';
import { UploadService } from 'src/app/services/upload.service';
import { GroupService } from 'src/app/services/group.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TopicIdeationService } from 'src/app/services/topic-ideation.service';
import { TopicEditDisabledDialogComponent } from 'src/app/topic/components/topic-edit-disabled-dialog/topic-edit-disabled-dialog.component';
import { TopicAttachmentService } from 'src/app/services/topic-attachment.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { TopicFormComponent } from 'src/app/topic/components/topic-form/topic-form.component';
import { BlockNavigationIfChange } from 'src/app/shared/pending-changes.guard';
import { TopicDiscussionService } from 'src/app/services/topic-discussion.service';

@Component({
  selector: 'app-ideation-create',
  templateUrl: './ideation-create.component.html',
  styleUrls: ['./ideation-create.component.scss'],
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
export class IdeationCreateComponent extends TopicFormComponent implements BlockNavigationIfChange {

  languages$: { [key: string]: any } = this.config.get('language').list;
  topic$: Observable<Topic>;

  /**/
  override tabs = ['info', 'settings', 'ideation_system', 'preview'];
  members = <any[]>[];
  public ideation = {
    id: '',
    creatorId: '',
    question: '',
    deadline: null,
    createdAt: '',
    updatedAt: ''
  };
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
    TopicDiscussionService: TopicDiscussionService,
    translate: TranslateService,
    cd: ChangeDetectorRef,
    @Inject(DomSanitizer) override sanitizer: DomSanitizer,
    private app: AppService,
    private TopicIdeationService: TopicIdeationService,
    private config: ConfigService) {
    super(dialog, route, router, UploadService, Notification, TopicService, GroupService, GroupMemberTopicService, TopicMemberGroupService, TopicMemberUserService, TopicInviteUserService, TopicAttachmentService, TopicDiscussionService, translate, cd, sanitizer)
    this.app.darkNav = true;
    this.hasUnsavedChanges = new Subject();
    this.groups$ = this.GroupService.loadItems().pipe(map((groups) => {
      groups.forEach((group: any) => {
        if (this.groupId && this.groupId === group.id) {
          const exists = this.topicGroups.find((mgroup) => mgroup.id === group.id);
          if (!exists) this.addGroup(group);
        }
      });

      return groups.filter((group) => group.visibility === this.GroupService.VISIBILITY.private || group.permission.level === GroupMemberTopicService.LEVELS.admin);
    }));
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
            console.log(topic);
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
            if (topic.ideationId) {
              setTimeout(() => {
                this.TopicIdeationService.get({ topicId: topic.id, ideationId: topic.ideationId }).pipe(take(1)).subscribe({
                  next: (ideation) => {
                    this.ideation = ideation;
                    this.ideation.question = this.ideation.question.trim();
                    if (this.ideation.deadline) {
                      this.deadline = new Date(this.ideation.deadline);
                      this.endsAt.date = this.ideation.deadline;
                      this.endsAt.min = this.deadline.getMinutes();
                      this.endsAt.h = this.deadline.getHours();
                      this.setEndsAtTime();
                      this.deadlineSelect = true;
                    }
                    cd.detectChanges();
                  }
                });
              });
            }
            this.downloadUrl = this.TopicService.download(topic.id);

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
        /*  if (this.voteCreateForm)
            this.voteCreateForm.saveVoteSettings();*/
      }
      if (tabIndex === 2) {
        if (!this.ideation.question) {
          this.Notification.removeAll();
          this.Notification.addError('VIEWS.IDEATION_CREATE.ERROR_MISSING_QUESTION');
          return;
        }
        /*  if (this.voteCreateForm)
            this.voteCreateForm.saveVoteSettings();*/
      }
      if (tabIndex + 1 === 3) {
        //   this.voteCreateForm?.filterOptions();
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
          this.topic = topic;
          this.ideation.question = ' ';
          this.createIdeation();
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
        if (!this.ideation.id) {
          this.createIdeation();
        } else if ([this.TopicService.STATUSES.draft, this.TopicService.STATUSES.ideation].indexOf(this.topic.status) > -1) {
          this.updateIdeation();
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
        this.saveImage()
          .subscribe({
            next: (res: any) => {
              if (res && !res.link) return;

              this.topicGroups.forEach((group) => {
                this.saveMemberGroup(group)
              });
              if (!this.ideation.id) {
                this.createIdeation(true);
              } else if ([this.TopicService.STATUSES.draft, this.TopicService.STATUSES.ideation].indexOf(this.topic.status) > -1) {
                this.updateIdeation(true);
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

  /*override publish() {
    this.titleInput?.nativeElement?.parentNode.parentNode.classList.remove('error');
    const isDraft = (this.topic.status === this.TopicService.STATUSES.draft);
    const updateTopic = Object.assign({}, this.topic);
    if (!updateTopic.intro?.length) {
      updateTopic.intro = null;
    }

    this.TopicService.patch(updateTopic).pipe(take(1)).subscribe({
      next: () => {
        if (!this.ideation.id) {
          this.createIdeation(true);
        } else if ([this.TopicService.STATUSES.draft, this.TopicService.STATUSES.ideation].indexOf(this.topic.status) > -1) {
          this.updateIdeation(true);
        }

        this.topicGroups.forEach((group) => {
          this.saveMemberGroup(group)
        });
        this.saveImage()
          .subscribe({
            next: (res: any) => {
              if (res && !res.link) return;
              if (res.link) {
                this.topic.imageUrl = res.link;
              }
              this.hasChanges$.next(false);
              this.router.navigate(['/', this.translate.currentLang, 'topics', this.topic.id]);
              this.TopicService.reloadTopic();
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
  }*/

  saveIdeationSettings(ideation?: any) {
    if (ideation) {
      this.ideation = ideation;
    }
  }

  createIdeation(updateTopicStatus?: boolean) {
    const createIdeation: any = Object.assign({ topicId: this.topic.id }, this.ideation);
    this.TopicIdeationService.save(createIdeation)
      .pipe(take(1))
      .subscribe({
        next: (ideation) => {
          //   this.TopicService.reloadTopic();
          this.ideation = ideation;
          if (updateTopicStatus) {
            const isDraft = (this.topic.status === this.TopicService.STATUSES.draft);
            const updateTopic = Object.assign({}, this.topic);
            updateTopic.status = this.TopicService.STATUSES.ideation;
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
          }
        },
        error: (res) => {
          this.nextTab('ideation_system');
          console.debug('createIdeation() ERR', res, res.errors);
          this.errors = res.errors;
          Object.values(this.errors).forEach((message) => {
            if (typeof message === 'string')
              this.Notification.addError(message);
          });
        }
      });
  }


  updateIdeation(updateTopicStatus?: boolean) {
    const updateIdeation = Object.assign({ topicId: this.topic.id }, this.ideation);
    return this.TopicIdeationService.update(updateIdeation).pipe(take(1)).subscribe({
      next: () => {
        if (updateTopicStatus) {
          const isDraft = (this.topic.status === this.TopicService.STATUSES.draft);
          const updateTopic = { id: this.topic.id, status: this.TopicService.STATUSES.ideation };
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
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  removeChanges() {
    console.log(this.topic)
    this.TopicService.revert(this.topic.id, this.topic.revision!).pipe(take(1)).subscribe(() => {
      setTimeout(() => {
        this.TopicService.reloadTopic();
      }, 200);
    });
  }
  /*DEADLINE */

  override setEndsAtTime() {
    this.endsAt.date = this.endsAt.date || new Date();
    this.deadline = new Date(this.endsAt.date);
    if (this.endsAt.h === 0 && this.endsAt.min === 0) {
      this.deadline = new Date(this.deadline.setDate(this.deadline.getDate() + 1));
    }

    let hour = this.endsAt.h;
    if (this.endsAt.timeFormat === 'PM') { hour += 12; }
    this.deadline.setHours(hour);
    this.deadline.setMinutes(this.endsAt.min);
    this.ideation.deadline = this.deadline;
    this.daysToVoteEnd();

    // this.setReminderOptions();
  };

  override isNextDisabled(tabSelected: string | void) {
    if (tabSelected === 'preview' && !this.TopicService.canDelete(this.topic)) {
      return true;
    } else if (!this.topic.title || !this.topic.description) {
      return true;
    } else if (tabSelected === 'ideation_system' && !this.ideation.question) {
      return true;
    }

    return false;
  }

  canEditIdeation() {
    return this.TopicService.canEdit(this.topic) && (this.topic.status !== this.TopicService.STATUSES.draft || this.topic.status !== this.TopicService.STATUSES.ideation);
  }
}
