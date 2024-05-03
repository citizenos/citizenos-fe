import { languages } from 'src/app/services/language.service';

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { map, take, takeWhile } from 'rxjs/operators';
import { DialogService } from 'src/app/shared/dialog';

import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { TopicNotificationService } from 'src/app/services/topic-notification.service';
import { User } from 'src/app/interfaces/user';
import { NotificationService } from 'src/app/services/notification.service';
import { Observable, of } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
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
  public uploadedImage?: any;
  public tmpImageUrl?: any;
  languages$: { [key: string]: any } = this.config.get('language').list;

  wWidth = window.innerWidth;
  errors: any = {};
  tabSelected;
  user?: Observable<User>;
  topicSearch: string = '';
  topics$ = of(<Topic[] | any[]>[]);
  resetPassword = <boolean>false;

  constructor(
    public app: AppService,
    public dialog: DialogService,
    public TopicNotificationService: TopicNotificationService,
    private Notification: NotificationService,
    private User: UserService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private router: Router,
    private config: ConfigService,
    private Auth: AuthService) {
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('profile')
        }
        return fragment
      }
      ));

    if (Auth.user$) {
      this.user = Auth.user$.pipe(
        map((user) => {
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

          return user
        })
      );
      /* Auth.user$.pipe(take(1))
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
         })*/
    }

    this.topics$ = TopicNotificationService.items$;
  }

  searchTopics() {
    if (this.topicSearch.length >= 3 || this.topicSearch.length === 0)
      this.TopicNotificationService.setParam('search', this.topicSearch);
  }

  ngOnInit(): void {
  }
  selectTab(tab: string) {
    this.router.navigate([], { fragment: tab })
  }

  setProfileLanguage(lang: string) {
    if (this.Auth.loggedIn$) {
      this.translate.use(lang);
      const parsedUrl = this.router.parseUrl(this.router.url);
      const outlet = parsedUrl.root.children[PRIMARY_OUTLET];

      let g = outlet?.segments.map(seg => seg.path) || [''];
      g.splice(0, 1);
      this.User.updateLanguage(lang).pipe(take(1)).subscribe({
        next: () => {
          this.form.language = lang;
          setTimeout(() => {
            this.Notification.addSuccess('MSG_SUCCESS_PUT_API_USERS_SELF');
          }, 500);
          this.router.navigate(g, { queryParams: parsedUrl.queryParams, fragment: parsedUrl.fragment || undefined });


        },
        error: (err) => {
          console.log(err);
          this.Notification.addError(err.message);
        }
      });
    }
  }

  toggleTopicNotifications(topic: any) {
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
        } else {
          topic.allowNotifications = true;
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
        .subscribe({
          next: (data) => {
            this.settings = data;
          },
          error: (res) => console.error(res)
        })
    }
  };

  doUpdateProfile(user: User) {
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
            this.imageFile = null;
            this.uploadedImage = null;
          }
        });
    }
    this.User
      .update(this.form.name, this.form.email, this.form.password, this.form.company, undefined, this.form.preferences, undefined, user?.termsVersion || undefined, this.form.newPassword)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.Notification.removeAll();
          this.Notification.addSuccess('MSG_SUCCESS_PUT_API_USERS_SELF');
          if (res.data) {
            const values = Object.assign({}, this.form, res.data);
            if (user.email !== this.form.email) {
              this.Notification.addInfo('MSG_INFO_CHECK_EMAIL_TO_VERIFY_YOUR_NEW_EMAIL_ADDRESS');
            }
            this.Auth.reloadUser();
            this.dialog.closeAll(); // Close all dialogs, including the one open now...u
          }
        },
        error: (res: any) => {
          if (res.status.message === 'Invalid password')
            this.errors = { password: res.status.message }
          return of({ error: res.status })
        }
      });

  };
  resizeImage(imageURL: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 320;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, image.width, image.height,
            0, 0, 320, 320);
        }
        var data = canvas.toDataURL('image/jpeg', 1);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'profileimage.jpg', { type: "image/jpeg" });
            canvas.remove();
            resolve({ file: file, imageUrl: data });
          }
        }, 'image/jpeg');

      };
      image.src = imageURL;
    });
  }

  fileUpload() {
    const files = this.fileInput?.nativeElement.files;
    this.uploadedImage = files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      await this.resizeImage(reader.result as string).then((res: any) => {
        this.tmpImageUrl = res.imageUrl;
        this.imageFile = res.file;
      });
    };
    reader.readAsDataURL(files[0]);

  }

  triggerUploadImage() {
    this.fileInput?.nativeElement.click();
  };

  imageChange(image: any) {
    this.imageFile = image;
  };

  deleteUserImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }

    this.User
      .update(this.form.name, this.form.email, this.form.password, this.form.company, '')
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          //    angular.extend(this.user, res.data);
          this.form.imageUrl = '';
          this.imageFile = null;
          this.uploadedImage = null;
        },
        error: (res) => console.error(res)
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
            this.Auth.logout().pipe(take(1)).subscribe({
              next: () => {
                this.router.navigate(['/']);
              }
            });
          });
      }
    });
  };
}
