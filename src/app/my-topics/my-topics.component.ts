import { Component, Inject } from '@angular/core';
import { UserTopicService } from '../services/user-topic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';
import { Topic } from '../interfaces/topic';
import { AppService } from '../services/app.service';
import { TopicService } from '../services/topic.service';
import { trigger, state, style } from '@angular/animations';
import { countries } from '../services/country.service';
import { languages } from '../services/language.service';
import { Country } from 'src/app/interfaces/country';
import { Language } from 'src/app/interfaces/language';

@Component({
  selector: 'my-topics',
  templateUrl: './my-topics.component.html',
  styleUrls: ['./my-topics.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
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
  topics$ = of(<Topic[]| any[]>[]);

  allTopics$: Topic[] = [];
  topicId = <string | null>null;
  public FILTERS_ALL = 'all';
  topicFilters = {
    category: this.FILTERS_ALL,
    status: this.FILTERS_ALL,
    country: this.FILTERS_ALL,
    engagements: this.FILTERS_ALL,
    language: this.FILTERS_ALL
  };
  mobileFilters:any = {
    category: false,
    status: false,
    engagements: false,
    country: false,
    language: false,
  }

  tabSelected = 'categories';
  categories$ = Object.keys(this.Topic.CATEGORIES);

  statuses$ = Object.keys(this.Topic.STATUSES);
  countrySearch = '';
  countrySearch$ = new BehaviorSubject('');
  countries = countries;
  countries$ = of(<Country[]>[]);
  countryFocus = false;

  languageSearch = '';
  languageSearch$ = new BehaviorSubject('');
  languages = languages;
  languages$ = of(<Language[]>[]);
  languageFocus = false;

  constructor(
    public Topic: TopicService,
    public UserTopicService: UserTopicService,
    public route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    public app: AppService,
    @Inject(TranslateService) public translate: TranslateService
    ) {
      this.topics$ = combineLatest([this.route.queryParams, this.searchString$]).pipe(
        switchMap(([queryParams, search]) => {
          UserTopicService.reset();
          this.allTopics$ = [];
          if (search) {
            UserTopicService.setParam('search', search);
          }
          Object.entries(queryParams).forEach((param) => {
            if(param[0] === 'status') {
              this.setStatus(param[1]);
            }
            UserTopicService.setParam(param[0], param[1]);
          })
          return UserTopicService.loadItems();
        }), map(
          (newtopics: any) => {
            console.log('NEWtopics', newtopics);
            this.allTopics$ = this.allTopics$.concat(newtopics);
            return this.allTopics$;
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

      showMobileOverlay () {
        const filtersShow = Object.entries(this.mobileFilters).find(([key, value]) => {
          return !!value;
        })
        if (filtersShow) return true;

        return false;
      }

  doSearch(search: string) {
    this.searchString$.next(search);
  }

  searchCountry(event: any) {
    this.countrySearch$.next(event);
  }

  searchLanguage(event: any) {
    this.languageSearch$.next(event);
  }

  setStatus(status: string) {
    this.topicFilters.status = status;
    if (status && status === 'all') {
      status = '';
    }
    this.allTopics$ = [];
    this.UserTopicService.setParam('offset',0)
    this.UserTopicService.setParam('favourite', null)
    this.UserTopicService.setParam('showModerated', null)
    if (status === 'favourite') {
      this.UserTopicService.setParam('favourite', true)
    } else if (status === 'showModerated') {
      this.UserTopicService.setParam('showModerated', true)
    } else {
      this.UserTopicService.setParam('statuses', [status]);
    }
  }

  setCategory(category: string) {
    this.topicFilters.category = category ;
    if (category && category === 'all') {
      category = '';
    }
    this.allTopics$ = [];
    this.UserTopicService.setParam('offset',0)
    this.UserTopicService.setParam('categories', [category]);
  }

  setFilter (filter: string) {
    this.allTopics$ = [];
    this.topicFilters.engagements = filter;
    this.UserTopicService.setParam('hasVoted', null);
    this.UserTopicService.setParam('creatorId', null);
    if (filter ===  'hasVoted') {
      this.UserTopicService.setParam(filter, true);
    } else if (filter ===  'hasNotVoted') {
      this.UserTopicService.setParam('hasVoted', false);
    } else if (filter === 'iCreated') {
      this.UserTopicService.setParam('creatorId', this.auth.user.value.id);
    }
  }

  trackByFn(index: number, element: any) {
    return element.id;
  }

/*
  private setFilter(filter: string) {
    let param = '';
    let value;
    if (this.UserTopicService.STATUSES.indexOf(filter) > -1) {
      param = 'statuses'; value = [filter];
    } else if (this.UserTopicService.VISIBILITY.indexOf(filter) > -1) {
      param = 'visibility'; value = filter;
    } else {
      switch (filter) {
        case 'all':
          break;
        case 'haveVoted':
          param = 'hasVoted'; value = true;
          break;
        case 'haveNotVoted':
          param = 'hasVoted'; value = false;
          break;
        case 'iCreated':
          param = 'creatorId'; value = this.auth.user.value.id;
          break;
        case 'pinnedTopics':
          param = 'pinned'; value = true;
          break;
        case 'showModerated':
          param = 'showModerated'; value = true;
          break;
      };
    }
    this.topicFilters.forEach((topicFilter) => {
      if (topicFilter.id === filter) {
        this.filters.selected = topicFilter;
      } else if (topicFilter.children) {
        topicFilter.children.forEach((childFilter) => {
          if (childFilter.id === filter) {
            this.filters.selected = childFilter;
          }
        })
      }
    });

    this.UserTopicService.setParam(param, value);
  }*/

  onSelect(id: string) {
    // this.UserTopicService.filterTopics(id);
    this.router.navigate([], { relativeTo: this.route, queryParams: { filter: id } });
  }

  doClearFilters() {
    this.setStatus(this.FILTERS_ALL);
    this.setCategory(this.FILTERS_ALL);
    this.setCountry('');
    this.setLanguage('');
    this.topicFilters.country = this.FILTERS_ALL;
    this.topicFilters.language = this.FILTERS_ALL;
  }

  setCountry(country: string) {
    if (typeof country !== 'string') {
      country = '';
    }

    this.countrySearch$.next(country);
    this.countrySearch = country;
    this.allTopics$ = [];
    this.topicFilters.country = country;
    this.UserTopicService.setParam('offset', 0);
    this.UserTopicService.setParam('country', country);
    this.UserTopicService.loadItems();
  }

  setLanguage(language: string) {
    if (typeof language !== 'string') {
      language = '';
    }
    this.languageSearch$.next(language);
    this.languageSearch = language;
    this.allTopics$ = [];
    this.topicFilters.language = language;
    this.UserTopicService.setParam('offset', 0)
    this.UserTopicService.setParam('language', language || null);
    this.UserTopicService.loadItems();
  }

  loadPage(page: any) {
    this.allTopics$ = [];
    this.UserTopicService.loadPage(page);
  }
}
