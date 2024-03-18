import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog';
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
import { RegisterDialogComponent } from '../account/components/register/register.component';
import { CreateComponent } from 'src/app/core/components/create/create.component';
import { ActivityFeedDialogComponent } from '../core/components/activity-feed/activity-feed.component';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../interfaces/apiResponse';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

declare let hwcrypto: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {
  showNav = false;
  showSearch = false;
  mobileTutorial = false;
  editMode = false;
  darkNav = false;
  mobileNavBox = false;
  tabletNav = false;
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

  constructor(private dialog: DialogService,
    private Title: Title,
    private Meta: Meta,
    private translate: TranslateService,
    public config: ConfigService,
    private Location: LocationService,
    private TopicService: TopicService,
    private GroupMemberTopicService: GroupMemberTopicService,
    private router: Router,
    private AuthService: AuthService,
    private http: HttpClient) { }

  showMobile() {
    return window.innerWidth <= 560;
  }

  doShowActivityModal(params?: any) {
    if (this.showMobile() && !params.topicId && !params.groupId) {
      this.router.navigate([this.translate.currentLang, 'activity']);
    } else {
      this.dialog.closeAll();
      const activitiesDialog = this.dialog.open(ActivityFeedDialogComponent, {
        data: params
      });
      this.showActivities = true;
      activitiesDialog.afterClosed().subscribe({
        next: () => {
          this.showActivities = false;
        }
      })
    }
  };

  doShowLogin(redirectSuccess?: string) {
    this.dialog.open(LoginDialogComponent, { data: { redirectSuccess } });
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
          this.AuthService.reloadUser();
          setTimeout(() => {
            this.router.navigate(['/']);
          });
        },
        error: (err) => {
          console.error('LOGOUT ERROR', err);
        }
      });
  }

  createNewTopic(groupId?: string, voting?: boolean) {
    const topic = <any>{};
    const url = ['topics'];
    if (voting) {
      url.push('vote');
    }
    topic.description = '<html><head></head><body></body></html>';
    this.TopicService.save(topic)
      .pipe(take(1))
      .subscribe((topic) => {
        const redirect = url.concat(['create', topic.id])
        if (groupId) {
              this.router.navigate(redirect, {queryParams: {groupId}})
        } else {
          this.router.navigate(redirect)
        }
      });
  }


  showCreateMenu() {
    if (!this.createMenu) {
      const createDialog = this.dialog.open(CreateComponent);
      createDialog.afterClosed().subscribe(() => {
        this.dialog.closeAll();
        this.createMenu = false;
      })
      this.createMenu = true;
    } else if (this.createMenu) {
      this.dialog.closeAll();
    }
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

  setPageTitle(title?: string) {
    this.Title.setTitle(this.translate.instant(title || 'META_DEFAULT_TITLE'));
    this.Meta.addTag({
      property: 'og:title',
      content: this.translate.instant(title || 'META_DEFAULT_TITLE')
    });
  }
}
