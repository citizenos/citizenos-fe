import { Component, Inject } from '@angular/core';
import { UserTopicService } from '@services/user-topic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';
import { Topic } from '../interfaces/topic';
import { AppService } from '@services/app.service';
import { TopicService } from '@services/topic.service';
import { trigger, state, style } from '@angular/animations';
import { countries } from '@services/country.service';
import { languages } from '@services/language.service';
import { Country } from '@interfaces/country';
import { Language } from '@interfaces/language';

@Component({
  selector: 'my-topics',
  templateUrl: './my-topics.component.html',
  styleUrls: ['./my-topics.component.scss'],
  standalone: false,
  animations: [
    trigger('openClose', [
      state('open', style({
        'maxHeight': '300px',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        'maxHeight': '50px',
        transition: '0.2s ease-in-out max-height'
      }))
    ])]
})
export class MyTopicsComponent {
  wWidth = window.innerWidth;
  moreFilters = false;
  searchInput = '';
  searchString$ = new BehaviorSubject('');
  topics$ = of(<Topic[] | any[]>[]);

  allTopics$: Topic[] = [];

  topicTypeFilter$ = new BehaviorSubject('');
  engagmentsFilter$ = new BehaviorSubject('');
  statusFilter$ = new BehaviorSubject('');
  orderFilter$ = new BehaviorSubject('');
  categoryFilter$ = new BehaviorSubject('');
  countryFilter$ = new BehaviorSubject('');
  languageFilter$ = new BehaviorSubject('');

  mobileFiltersList = false;
  showCreate = false;

  countrySearch = '';
  countrySearch$ = new BehaviorSubject('');
  countries = countries.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });
  countries$ = of(<Country[]>[]);

  languageSearch = '';
  languageSearch$ = new BehaviorSubject('');
  languages = languages.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });
  languages$ = of(<Language[]>[]);
  filtersSet = false;

  filtersData = {
    visibility: {
      isMobileOpen: false,
      placeholder: "VIEWS.MY_TOPICS.FILTER_TOPIC_TYPE",
      selectedValue: "",
      preSelectedValue: "",
      items: [
        { title: 'VIEWS.MY_TOPICS.FILTER_ALL', value: "all"},
        { title: 'VIEWS.MY_TOPICS.FILTERS.MY_PUBLIC_TOPICS', value: this.Topic.VISIBILITY.public},
        { title: 'VIEWS.MY_TOPICS.FILTERS.MY_PRIVATE_TOPICS', value: this.Topic.VISIBILITY.private},
        { title: 'VIEWS.MY_TOPICS.FILTERS.TOPICS_MODERATED', value: "showModerated"},
        { title: 'VIEWS.MY_TOPICS.FILTERS.TOPICS_FAVOURITED', value: "favourite"},
      ]
    },
    engagements: {
      isMobileOpen: false,
      placeholder: "VIEWS.MY_TOPICS.FILTER_MY_ENGAGEMENT",
      selectedValue: "",
      preSelectedValue: "",
      items: [
        { title: 'VIEWS.MY_TOPICS.FILTER_ALL', value: "all"},
        { title: 'VIEWS.MY_TOPICS.FILTERS.TOPICS_I_HAVE_VOTED', value: "hasVoted"},
        { title: 'VIEWS.MY_TOPICS.FILTERS.TOPICS_I_HAVE_NOT_VOTED', value: "hasNotVoted"},
        { title: 'VIEWS.MY_TOPICS.FILTERS.TOPICS_I_CREATED', value: "iCreated"},
      ]
    },
    status: {
      isMobileOpen: false,
      placeholder: "VIEWS.MY_TOPICS.FILTER_STATUS",
      selectedValue: "",
      preSelectedValue: "",
      items: [
        { title: 'TXT_TOPIC_STATUS_ALL', value: "all"},
        ...Object.keys(this.Topic.STATUSES).map((status) => {
          return { title: `TXT_TOPIC_STATUS_${status}`, value: status }
        }),
      ]
    },
    orderBy: {
      isMobileOpen: false,
      placeholder: "VIEWS.MY_TOPICS.FILTER_ORDER",
      selectedValue: "",
      preSelectedValue: "",
      items: [
        { title: 'VIEWS.MY_TOPICS.FILTER_ALL', value: "all"},
        { title: 'VIEWS.MY_TOPICS.FILTERS.ORDER_MOST_PARTICIPANTS', value: "membersCount"},
        { title: 'VIEWS.MY_TOPICS.FILTERS.ORDER_MOST_RECENT', value: "created"},
      ]
    },
    category: {
      isMobileOpen: false,
      placeholder: "VIEWS.MY_TOPICS.FILTER_CATEGORIES",
      selectedValue: "",
      preSelectedValue: "",
      items: [
        { title: 'TXT_TOPIC_CATEGORY_ALL', value: "all"},
        ...Object.keys(this.Topic.CATEGORIES).map((cat) => {
          return { title: `TXT_TOPIC_CATEGORY_${cat}`, value: cat }
        }),
      ]
    },
    country: {
      isMobileOpen: false,
      placeholder: "VIEWS.MY_TOPICS.FILTER_COUNTRY",
      selectedValue: "",
      preSelectedValue: "",
      /**
       * @note Only for desktop. For mobile it looks for observable.
       */
      items: [
        { title: 'VIEWS.MY_TOPICS.FILTER_ALL', value: "all"},
        ...this.countries.map((it) => {
          return { title: it.name, value: it.name }
        }),
      ]
    },
    language: {
      isMobileOpen: false,
      placeholder: "VIEWS.MY_TOPICS.FILTER_LANGUAGE",
      selectedValue: "",
      preSelectedValue: "",
      /**
       * @note Only for desktop. For mobile it looks for observable.
       */
      items: [
        { title: 'VIEWS.MY_GROUPS.FILTER_ALL', value: "all"},
        ...this.languages.map((it) => {
          return { title: it.name, value: it.name }
        }),
      ]
    },
  };

  get filterKeys() {
    return Object.keys(this.filtersData) as Array<keyof typeof this.filtersData>;
  }

  get hasMobileOpen() {
    return Object.values(this.filtersData).some((filter) => filter.isMobileOpen);
  }

  constructor(
    public Topic: TopicService,
    public UserTopicService: UserTopicService,
    public route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    public app: AppService,
    @Inject(TranslateService) public translate: TranslateService
  ) {

    this.topics$ = combineLatest([this.topicTypeFilter$, this.engagmentsFilter$, this.statusFilter$, this.orderFilter$, this.categoryFilter$, this.countryFilter$, this.languageFilter$, this.searchString$])
      .pipe(
        switchMap(([topicTypeFilter, engagmentsFilter, statusFilter, orderFilter, categoryFilter, countryFilter, languageFilter, search]) => {
          UserTopicService.reset();
          this.allTopics$ = [];
          if (topicTypeFilter) {
            if (UserTopicService.VISIBILITY.indexOf(topicTypeFilter) > -1) {
              UserTopicService.setParam('visibility', topicTypeFilter);
            } else if (['favourite', 'showModerated'].indexOf(topicTypeFilter) > -1) {
              UserTopicService.setParam(topicTypeFilter, topicTypeFilter);
            }
          }

          if (engagmentsFilter) {
            if (engagmentsFilter === 'hasVoted') {
              UserTopicService.setParam(engagmentsFilter, true);
            } else if (engagmentsFilter === 'hasNotVoted') {
              UserTopicService.setParam('hasVoted', false);
            } else if (engagmentsFilter === 'iCreated') {
              UserTopicService.setParam('creatorId', this.auth.user.value.id);
            }
          }

          if (statusFilter) {
            UserTopicService.setParam('statuses', [statusFilter]);
          }

          if (orderFilter) {
            UserTopicService.setParam('orderBy', orderFilter);
            UserTopicService.setParam('order', 'desc');
          }

          if (categoryFilter) {
            UserTopicService.setParam('categories', [categoryFilter]);
          }

          if (countryFilter) {
            UserTopicService.setParam('country', countryFilter);
          }
          if (languageFilter) {
            UserTopicService.setParam('language', languageFilter);
          }

          if (search) {
            UserTopicService.setParam('search', search);
          }

          return UserTopicService.loadItems();
        }), map(
          (newtopics: any) => {
            if (newtopics.length) {
              this.filtersSet = true;
            }
            this.allTopics$ = this.allTopics$.concat(newtopics);
            return this.allTopics$;
          }
        ));

    this.countries$ = this.countrySearch$.pipe(switchMap((string) => {
      const countries = this.countries.filter((country) => country.name.toLowerCase().indexOf(string.toLowerCase()) === 0);

      return [countries];
    }));

    this.languages$ = this.languageSearch$.pipe(switchMap((string) => {
      const languages = this.languages.filter((language) => language.name.toLowerCase().indexOf(string.toLowerCase()) === 0);

      return [languages];
    }));
  }

  showCreateMenu() {
    this.showCreate = !this.showCreate;
  }

  closeMobileFilter() {
    const keys = this.filterKeys;

    keys.forEach((key) => {
      this.filtersData[key].isMobileOpen = false;
      this.filtersData[key].preSelectedValue = "";
      switch(key) {
        case "language": {
          this.languageSearch$.next(this.languageSearch);
          break;
        }
        case "country": {
          this.countrySearch$.next(this.countrySearch);
          break;
        }
        default:
      }
    })
  }

  searchCountry(event: any) {
    this.countrySearch$.next(event);
  }

  searchLanguage(event: any) {
    this.languageSearch$.next(event);
  }

  chooseFilterValue (type: keyof typeof this.filtersData, option: string) {
    this.filtersData[type].preSelectedValue = option;
  }

  setFilterValue(filter: keyof typeof this.filtersData, val: string) {
    const value = val === 'all' ? '' : val;
    switch (filter) {
      case 'visibility':
        this.topicTypeFilter$.next(value);
        break;
      case 'status':
        this.statusFilter$.next(value);
        break;
      case 'orderBy':
        this.orderFilter$.next(value);
        break;
      case 'engagements':
        this.engagmentsFilter$.next(value);
        break;
      case 'category':
        this.categoryFilter$.next(value);
        break;
      case 'country':
        this.countryFilter$.next(value);
        break;
      case 'language':
        this.languageFilter$.next(value);
        break;
      default:
    }

    this.filtersData[filter].selectedValue = value;
  }

  getActiveFilterText(key: keyof typeof this.filtersData, val: string) {
    const value = val === '' ? 'all' : val;
    return this.filtersData[key].items.find((item) => item.value === value)!.title;
  }

  doSearch(search: string) {
    this.searchString$.next(search);
  }

  onSelect(id: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { filter: id } });
  }

  doClearFilters() {
    const keys = this.filterKeys;
    keys.forEach((key) => {
      this.setFilterValue(key, '');
    })
  }

  loadPage(page: any) {
    this.allTopics$ = [];
    this.UserTopicService.loadPage(page);
  }
}
