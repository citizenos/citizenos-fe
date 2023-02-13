
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, map, take, takeWhile, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TopicNotificationSettingsComponent } from 'src/app/topic/components/topic-notification-settings/topic-notification-settings.component';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { TopicNotificationService } from 'src/app/services/topic-notification.service';
import { User } from 'src/app/interfaces/user';
import { NotificationService } from '../services/notification.service';
import { of } from 'rxjs';
import { Topic } from '../interfaces/topic';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @ViewChild('imageUpload') fileInput?: ElementRef;
  form: any = {
    name: null,
    email: null,
    password: null,
    newPassword: null,
    company: null,
    imageUrl: null,
    passwordConfirm: null,
    preferences: {
      showInSearch: false,
      notifications: {
        topics: {},
        groups: {}
      }
    }
  };
  public settings: any;
  public imageFile?: any;
  public tmpImageUrl?: any;

  wWidth = window.innerWidth;
  errors: any = {};
  tabSelected;
  user?: User;
  topicSearch: string = '';
  topics$ = of(<Topic[] | any[]>[]);
  constructor(
    public app: AppService,
    public dialog: MatDialog,
    public TopicNotificationService: TopicNotificationService,
    private Notification: NotificationService,
    private User: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private Auth: AuthService) {
      console.log('ACCOUNT')
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if(!fragment) {
          return this.selectTab('profile')
        }
        return fragment
      }
    ));

    if (Auth.user$) {
      Auth.user$.pipe(take(1))
        .subscribe((user) => {
          if (!user.preferences) {
            user.preferences = {
              showInSearch: false,
              notifications: {
                topics: {},
                groups: {}
              }
            }
          }
          this.form = Object.assign(this.form, user);
          this.user = user;
        })
    }

    this.topics$ = TopicNotificationService.items$;
  }

  searchTopics () {
    console.log(this.topicSearch, this.topicSearch.length)
    if (this.topicSearch.length >= 3  || this.topicSearch.length === 0)
      this.TopicNotificationService.setParam('search', this.topicSearch);
  }

  ngOnInit(): void {

  }

  selectTab(tab: string) {
    this.router.navigate( [], { fragment: tab } )
  }

  toggleTopicNotifications(topic: any) {
    console.log(topic);
    if (!topic.allowNotifications) {
      const removeDialog = this.dialog
        .open(
          ConfirmDialogComponent, {
          data: {
            level: 'delete',
            heading: 'MODALS.REMOVE_TOPIC_NOTIFICATIONS_CONFIRM_TITLE',
            title: 'MODALS.REMOVE_TOPIC_NOTIFICATIONS_CONFIRM_ARE_YOU_SURE',
            confirmBtn: 'MODALS.REMOVE_TOPIC_NOTIFICATIONS_CONFIRM_YES',
            closeBtn: 'MODALS.REMOVE_TOPIC_NOTIFICATIONS_CONFIRM_NO'
          }
        });

      removeDialog.afterClosed().subscribe((result) => {
        if (result === true) {
          this.TopicNotificationService
            .delete({ topicId: topic.topicId }).pipe(take(1)).subscribe();
        }
      });
    } else {
      this.TopicNotificationService.update({
        topicId: topic.topicId,
        preferences: {
          Topic: true,
          TopicComment: true,
          CommentVote: true,
          TopicReport: true,
          TopicVoteList: true,
          TopicEvent: true
        },
        allowNotifications: true
      }).pipe(take(1))
      .subscribe((data) => {
        console.log(data);
        this.settings = data;
      })
    }
  };

  doUpdateProfile() {
    this.errors = {};
    if (this.form.newPassword) {
      if (this.form.newPassword !== this.form.passwordConfirm) {
        this.errors = {
          newPassword: 'MSG_ERROR_PASSWORD_MISMATCH'
        };
        return;
      }
    }
    if (this.imageFile) {
      this.User
        .uploadUserImage(this.imageFile).pipe(
          takeWhile((e) => !e.link)
        )
        .subscribe((res: any) => {
          if (res.link) {
            this.form.imageUrl = res.link;
          }
        });
    } else {
      this.User
        .update(this.form.name, this.form.email, this.form.password, this.form.company, this.form.imageUrl, this.form.preferences, undefined, this.user?.termsVersion || undefined, this.form.newPassword)
        .pipe(take(1),
          catchError((res: any) => {
            if (res.status.message === 'Invalid password')
              this.errors = { password: res.status.message }
            return of({ error: res.status })
          }))
        .subscribe((res: any) => {
          if (res.data) {
            const values = Object.assign({}, this.form, res.data);
            if (this.user?.email !== this.form.email) {
              this.Notification.addInfo('MSG_INFO_CHECK_EMAIL_TO_VERIFY_YOUR_NEW_EMAIL_ADDRESS');
            }

            this.dialog.closeAll(); // Close all dialogs, including the one open now...u
          }
        });
    }
  };

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
  triggerUploadImage() {
    this.fileInput?.nativeElement.click();
  };

  deleteUserImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }

    this.User
      .update(this.form.name, this.form.email, this.form.password, this.form.company, '')
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
        //    angular.extend(this.user, res.data);
        this.form.imageUrl = '';
        this.form.imageUrl = this.tmpImageUrl = null;
        this.imageFile = null;
      })
  };

  doDeleteAccount() {
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.USER_DELETE_CONFIRM_HEADING',
        title: 'MODALS.USER_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.USER_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.USER_DELETE_CONFIRM_TXT_USER_DELETED', 'MODALS.USER_DELETE_CONFIRM_TXT_KEEP_DATA_ANONYMOUSLY'],
        confirmBtn: 'MODALS.USER_DELETE_CONFIRM_YES',
        closeBtn: 'MODALS.USER_DELETE_CONFIRM_NO'
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.User
          .deleteUser()
          .pipe(take(1))
          .subscribe((res) => {
            this.Auth.logout().pipe(take(1)).subscribe();
            this.router.navigate(['/']);
          });
      }
    });
  };
}
