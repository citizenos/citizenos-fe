
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap, of, take, catchError, map, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { DialogService } from 'src/app/shared/dialog';

import { GroupMemberUserService } from 'src/app/services/group-member-user.service';
import { GroupService } from 'src/app/services/group.service';
import { GroupJoinService } from 'src/app/services/group-join.service';
import { Group } from 'src/app/interfaces/group';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../services/auth.service';
import { TopicService } from '../services/topic.service';
import { GroupInviteDialogComponent } from './components/group-invite/group-invite.component';
import { AppService } from '../services/app.service';
import { GroupMemberTopicService } from '../services/group-member-topic.service';
import { GroupAddTopicsDialogComponent } from './components/group-add-topics/group-add-topics.component';
import { TranslateService } from '@ngx-translate/core';
import { trigger, state, style } from '@angular/animations';
import { Topic } from '../interfaces/topic';
import { User } from '../interfaces/user';
import { GroupJoinComponent } from './components/group-join/group-join.component';
import { countries } from '../services/country.service';
import { languages } from '../services/language.service';
import { GroupSettingsComponent } from './components/group-settings/group-settings.component';
import { Country } from '../interfaces/country';
import { Language } from '../interfaces/language';

@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        minHeight: 'min-content',
        maxHeight: 'min-content',
        transition: 'max-height 0.2s ease-in 0.2'
      })),
      state('closed', style({
        overflowY: 'hidden',
        transition: 'max-height 0.2s ease-in 0.2'
      }))
    ]),
    trigger('openSlide', [
      // ...
      state('open', style({
        minHeight: 'auto',
        'maxHeight': '400px',
        transition: 'max-height 0.2s ease-in 0.2'
      })),
      state('closed', style({
        transition: 'max-height 0.2s ease-in 0.2'
      }))
    ])]
})
export class GroupComponent implements OnInit {
  group$;
  groupId: string = '';
  groupTitle: string = '';
  tabSelected;
  wWidth: number = window.innerWidth;
  moreInfo = false;
  topics$: Observable<Topic[] | any[]> = of([]);
  allTopics$: Topic[] = [];

  users$: Observable<User[] | any[]> = of([]);
  showNoEngagements = false;
  moreFilters = false;
  topicStatuses = Object.keys(this.TopicService.STATUSES);

  countrySearch = '';
  countrySearch$ = new BehaviorSubject('');
  countries = countries.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });
  countries$ = of(<Country[]>[]);
  countryFocus = false;

  languageSearch = '';
  languageSearch$ = new BehaviorSubject('');
  languages = languages.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });
  languages$ = of(<Language[]>[]);
  public FILTERS_ALL = 'all';
  topicFilters = {
    category: this.FILTERS_ALL,
    status: this.FILTERS_ALL,
    engagements: this.FILTERS_ALL,
    country: this.FILTERS_ALL,
    language: this.FILTERS_ALL
  };

  groupActions = false;
  mobileTopicFiltersList = false;
  /*
    mobileTopicFilters: any = {
      category: this.FILTERS_ALL,
      status: this.FILTERS_ALL,
      engagements: this.FILTERS_ALL,
      country: this.FILTERS_ALL,
      language: this.FILTERS_ALL
    }*/
  mobileTopicFilters: any = {
    category: false,
    status: false,
    engagements: false,
    country: false,
    language: false,
  }
  searchTopicsInput = '';
  searchTopicString$ = new BehaviorSubject('');

  searchUsersInput = '';
  searchUserString$ = new BehaviorSubject('');

  constructor(public dialog: DialogService,
    private GroupService: GroupService,
    private GroupJoinService: GroupJoinService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    public TopicService: TopicService,
    public GroupMemberUserService: GroupMemberUserService,
    public auth: AuthService,
    public app: AppService,
    public GroupMemberTopicService: GroupMemberTopicService) {

    this.users$ = this.GroupMemberUserService.loadItems().pipe(
      tap((topics) => {
        if (topics.length === 0) {
          this.showNoEngagements = true;
        }
      })
    );

    this.group$ = this.route.params.pipe<Group>(
      switchMap((params) => {
        this.groupId = <string>params['groupId'];

        GroupMemberTopicService.reset()
        GroupMemberTopicService.setParam('groupId', this.groupId);
        GroupMemberUserService.reset();
        GroupMemberUserService.setParam('groupId', this.groupId);
        return this.GroupService.loadGroup(params['groupId']).pipe(
          tap((group) => {
            this.groupTitle = group.name;
            this.app.setPageTitle(group.name);
            this.app.group.next(group);
          }),
          catchError((err: any) => {
            console.error(err);
            if (['401', '403', '404'].indexOf(err.status))
              this.router.navigate(['error/' + err.status])
            return of(err);
          })
        )
      })
    );

    this.topics$ = combineLatest([this.route.queryParams, this.searchTopicString$]).pipe(
      switchMap(([queryParams, search]) => {
        if (!this.groupId) return [];
        GroupMemberTopicService.reset();
        GroupMemberTopicService.setParam('groupId', this.groupId);
        this.allTopics$ = [];
        if (search) {
          GroupMemberTopicService.setParam('title', search);
        }
        Object.entries(queryParams).forEach((param) => {
          GroupMemberTopicService.setParam(param[0], param[1]);
        })
        return GroupMemberTopicService.loadItems();
      }), map(
        (newtopics: any) => {
          this.allTopics$ = this.allTopics$.concat(newtopics);
          return this.allTopics$;
        }
      ));

    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        this.app.setPageTitle(this.groupTitle);
        if (!fragment) {
          return this.selectTab('topics')
        }
        return fragment
      }
      ));


    this.countries$ = this.countrySearch$.pipe(switchMap((string) => {
      const countries = this.countries.filter((country) => country.name.toLowerCase().indexOf(string.toLowerCase()) > -1);

      return [countries];
    }));
    this.languages$ = this.languageSearch$.pipe(switchMap((string) => {
      const languages = this.languages.filter((language) => language.name.toLowerCase().indexOf(string.toLowerCase()) > -1);

      return [languages];
    }));
  }

  closeMobileFilter() {
    const filtersShow = Object.entries(this.mobileTopicFilters).find(([key, value]) => {
      return !!value;
    })
    if (filtersShow)
      this.mobileTopicFilters[filtersShow[0]] = false;
  }

  showMobileOverlay() {
    const filtersShow = Object.entries(this.mobileTopicFilters).find(([key, value]) => {
      return !!value;
    });

    if (filtersShow) return true;

    return false;
  }

  setStatus(status: string) {
    this.GroupMemberTopicService.setParam('showModerated', null)
    if (status && status === 'all') {
      status = '';
    }
    this.allTopics$ = [];
    this.GroupMemberTopicService.setParam('offset', 0)
    if (status === 'showModerated') {
      this.topicFilters.status = 'showModerated';
      this.GroupMemberTopicService.setParam('showModerated', true)
    } else {
      this.topicFilters.status = status || 'all';
      this.GroupMemberTopicService.setParam('statuses', [status]);
    }
  }

  setCountry(country: string) {
    if (typeof country !== 'string') {
      country = '';
    }

    this.countrySearch$.next(country);
    this.countrySearch = country;
    this.allTopics$ = [];
    this.topicFilters.country = country;
    this.GroupMemberTopicService.setParam('offset', 0);
    this.GroupMemberTopicService.setParam('country', country);
    this.GroupMemberTopicService.loadItems();
  }

  setLanguage(language: string) {
    if (typeof language !== 'string') {
      language = '';
    }
    this.languageSearch$.next(language);
    this.languageSearch = language;
    this.allTopics$ = [];
    this.topicFilters.language = language;
    this.GroupMemberTopicService.setParam('offset', 0)
    this.GroupMemberTopicService.setParam('language', language || null);
    this.GroupMemberTopicService.loadItems();
  }

  searchCountry(event: any) {
    this.countrySearch$.next(event);
  }

  searchLanguage(event: any) {
    this.languageSearch$.next(event);
  }

  searchTopics(search: string) {
    this.searchTopicString$.next(search);
  }

  searchUsers(search: string) {
    this.searchUserString$.next(search);
  }

  selectTab(tab: string) {
    this.router.navigate([], { fragment: tab })
  }

  ngOnInit(): void {
  }

  doClearFilters() {
    this.setStatus(this.FILTERS_ALL);
    this.setCountry('');
    this.setLanguage('');
    this.topicFilters.country = this.FILTERS_ALL;
    this.topicFilters.language = this.FILTERS_ALL;

  }

  shareGroupDialog(group: Group) {
    if (this.app.group) {
      const inviteDialog = this.dialog.open(GroupInviteDialogComponent, { data: { group: group } });
      inviteDialog.afterClosed().subscribe(result => {
      });
    }
  }

  leaveGroup() {
    const leaveDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        heading: 'MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_TXT_ARE_YOU_SURE_CONTINUE',
        points: ['MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_TXT_ARE_YOU_SURE'],
        confirmBtn: 'MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_BTN_NO'
      }
    });

    leaveDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.GroupMemberUserService
          .delete({ groupId: this.groupId, userId: this.auth.user.value.id })
          .subscribe({
            next: (result) => {
              const url = this.router.url;
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.router.navigateByUrl(url));
            },
            error: (err) => {
              console.error(err);
            }
          });
      }
    });
  }

  showSettings(group: Group) {
    const settingsDialog = this.dialog.open(GroupSettingsComponent, {
      data: {
        group
      }
    });

    settingsDialog.afterClosed().subscribe(result => {
      if (result === true) {
        /* this.GroupService.delete(group)
           .pipe(take(1))
           .subscribe((res) => {
             this.router.navigate(['../'], { relativeTo: this.route });
           })*/
      }
    });
  }

  deleteGroup(group: Group) {
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.GROUP_DELETE_CONFIRM_HEADING',
        title: 'MODALS.GROUP_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.GROUP_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.GROUP_DELETE_CONFIRM_TXT_GROUP_DELETED', 'MODALS.GROUP_DELETE_CONFIRM_TXT_LOSE_ACCESS'],
        confirmBtn: 'MODALS.GROUP_DELETE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_DELETE_CONFIRM_BTN_NO'
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.GroupService.delete(group)
          .pipe(take(1))
          .subscribe((res) => {
            this.router.navigate([this.translate.currentLang, 'my', 'groups']);
          })
      }
    });
  }

  addTopicDialog(group: Group) {
    this.dialog.open(GroupAddTopicsDialogComponent, {
      data: {
        group: group
      }
    });
  }

  joinGroup(group: Group) {
    const joinDialog = this.dialog.open(GroupJoinComponent, {
      data: {
        group: group
      }
    })/*.openConfirm({
        template: '/views/modals/group_join_confirm.html',
        closeByEscape: false
    })*/
    joinDialog.afterClosed().subscribe((res) => {
      if (res === true) {
        this.GroupJoinService
          .join(group.join.token).pipe(take(1)).subscribe(
            {
              next: (res) => {
                group.userLevel = res.userLevel;
              },
              error: (err) => {
                console.error('Failed to join Topic', err)
              }
            }
          )
      }

    });
  }

  toggleFavourite(group: Group) {
    this.GroupService.toggleFavourite(group);
  }

  canUpdate(group: Group) {
    return this.GroupService.canUpdate(group);
  }

  trackByTopic(index: number, element: any) {
    return element.id;
  }
}
