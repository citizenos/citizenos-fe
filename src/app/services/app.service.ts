import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, take } from 'rxjs';
import { Group } from '../interfaces/group';
import { Topic } from '../interfaces/topic';
import { TopicNotificationSettingsComponent } from '../topic/components/topic-notification-settings/topic-notification-settings.component';
import { ConfigService } from './config.service';
import { TopicService } from './topic.service';
import { LocationService } from 'src/app/services/location.service';
import { GroupMemberTopicService } from './group-member-topic.service';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../account/components/login/login.component';
import { RegisterComponent, RegisterDialogComponent } from '../account/components/register/register.component';
import { CreateComponent } from 'src/app/core/components/create/create.component';
import { ActivityFeedComponent } from '../core/components/activity-feed/activity-feed.component';
import { LoginComponent } from '../account/components/login/login.component';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../interfaces/apiResponse';
declare let hwcrypto: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {
  showNav = false;
  showSearch = false;
  editMode = false;
  darkNav = false;
  showActivities = false;
  searchAllowed = true;
  addArgument = new BehaviorSubject(false);
  showSearchResults = false;
  showSearchFiltersMobile = false; //remove after UI update
  showHelp = new BehaviorSubject(false);
  group = new BehaviorSubject<Group | undefined>(undefined);
  topic: Topic | undefined;
  topicsSettings = false;
  wWidth = window.innerWidth;
  createMenu = false;
  accessibility = new BehaviorSubject({
    contrast: 'default',
    text: ''
  });

  constructor(private dialog: MatDialog,
    public config: ConfigService,
    private Location: LocationService,
    private TopicService: TopicService,
    private GroupMemberTopicService: GroupMemberTopicService,
    private router: Router,
    private AuthService: AuthService,
    private http: HttpClient) { }

  showMobile () {
    return window.innerWidth <= 560;
  }

  doShowActivityModal(params?: any) {
    this.dialog.closeAll();
    const activitiesDialog = this.dialog.open(ActivityFeedComponent, {
      data: params
    });
    this.showActivities = true;
    activitiesDialog.afterClosed().subscribe({
      next: () => {
        this.showActivities = false;
      }
    })
  };

  doShowLogin(redirectSuccess?: string) {
    this.dialog.open(LoginDialogComponent, {data: {redirectSuccess}});
  }

  doShowRegister(email?: string) {
    this.dialog.closeAll();
    this.dialog.open(RegisterDialogComponent, {
      data: {
        email: email,
        redirectSuccess: this.Location.currentUrl()
      }
    })
  }

  doShowTopicNotificationSettings(topicId: string) {
    this.dialog.open(TopicNotificationSettingsComponent, { data: { topicId } });
  }

  isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
  };

  logout() {
    this.AuthService.logout()
    .pipe(take(1))
    .subscribe({
      next: (done) => {
        this.AuthService.status().pipe(take(1)).subscribe();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('LOGOUT ERROR', err);
      }
    });
  }

  createNewTopic(title?: string, visibility?: string, groupId?: string, groupLevel?: string) {
    const topic = <any>{};
    if (title) {
      topic['description'] = '<html><head></head><body><h1>' + title + '</h1></body></html>';
    }
    if (visibility === 'public') {
      topic['visibility'] = this.TopicService.VISIBILITY.public;
    }

    this.TopicService.save(topic)
      .pipe(take(1))
      .subscribe((topic) => {
        if (groupId) {
          const level = groupLevel || this.GroupMemberTopicService.LEVELS.read;
          const member = {
            groupId: groupId,
            topicId: topic.id,
            level: level
          };
          this.GroupMemberTopicService
            .save(member)
            .pipe(take(1)).
            subscribe(() => {
              //this.router.navigate(['/topics', topic.id], { queryParams: { editMode: true } })
              return topic;
            });
        } else {
          //this.router.navigate(['/topics', topic.id], { queryParams: { editMode: true } })
          return topic;
        }
      });
  }


  showCreateMenu() {
    if (!this.createMenu) {
      const createDialog = this.dialog.open(CreateComponent);
      createDialog.afterClosed().subscribe(() => {
        this.createMenu = false;
      })
    }
    this.createMenu = !this.createMenu;
  }

  hwCryptoErrorToTranslationKey(err: any) {
    const errorKeyPrefix = 'MSG_ERROR_HWCRYPTO_';
    switch (err.message) {
      case hwcrypto.NO_CERTIFICATES:
      case hwcrypto.USER_CANCEL:
      case hwcrypto.NO_IMPLEMENTATION:
        return errorKeyPrefix + err.message.toUpperCase();
        break;
      case hwcrypto.INVALID_ARGUMENT:
      case hwcrypto.NOT_ALLOWED:
      case hwcrypto.TECHNICAL_ERROR:
        console.error(err.message, 'Technical error from HWCrypto library', err);
        return errorKeyPrefix + 'TECHNICAL_ERROR';
        break;
      default:
        console.error(err.message, 'Unknown error from HWCrypto library', err);
        return errorKeyPrefix + 'TECHNICAL_ERROR';
    }
  };

  stats() {
    const path = this.Location.getAbsoluteUrlApi('/api/stats');

    return this.http.get<ApiResponse>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  };
}
