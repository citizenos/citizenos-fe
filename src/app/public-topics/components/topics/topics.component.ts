import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { TopicService } from 'src/app/services/topic.service';
import { PublicTopicService } from 'src/app/services/public-topic.service';
import { switchMap, map, of, Subject, BehaviorSubject, combineLatest, } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { trigger, state, style } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { countries } from 'src/app/services/country.service';
import { languages } from 'src/app/services/language.service';
import { Country } from 'src/app/interfaces/country';
import { Language } from 'src/app/interfaces/language';

@Component({
  selector: 'public-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
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
export class TopicsComponent implements OnInit {

  //mew
  moreFilters = false;
  searchInput = '';
  searchString$ = new BehaviorSubject('');
  topics$ = of(<Topic[] | any[]>[]);
  //new
  public FILTERS_ALL = 'all';
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
  topicFilters = {
    category: this.FILTERS_ALL,
    status: this.FILTERS_ALL,
    country: this.FILTERS_ALL,
    language: this.FILTERS_ALL
  };

  mobileFilters:any = {
    category: false,
    status: false,
    country: false,
    language: false,
  }

  tabSelected = 'categories';
  categories$ = Object.keys(this.Topic.CATEGORIES);

  statuses$ = Object.keys(this.Topic.STATUSES);
  allTopics$: Topic[] = [];
  destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private Topic: TopicService,
    public PublicTopicService: PublicTopicService,
    public auth: AuthService,
    public app: AppService) {
    this.PublicTopicService.reset();
    this.topics$ = combineLatest([this.route.queryParams, this.searchString$]).pipe(
      switchMap(([queryParams, search]) => {
        PublicTopicService.reset();
        this.allTopics$ = [];
        if (search) {
          PublicTopicService.setParam('title', search);
        }
        Object.entries(queryParams).forEach((param) => {
          PublicTopicService.setParam(param[0], param[1]);
        })
        return PublicTopicService.loadItems();
      }), map(
        (newtopics: any) => {
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

  searchCountry(event: any) {
    this.countrySearch$.next(event);
  }

  searchLanguage(event: any) {
    this.languageSearch$.next(event);
  }

  trackByFn(index: number, element: any) {
    return element.id;
  }

  setStatus(status: string) {
    this.PublicTopicService.setParam('showModerated', null)
    if (status && status === 'all') {
      status = '';
    }
    this.allTopics$ = [];
    this.PublicTopicService.setParam('offset', 0)
    if (status === 'showModerated') {
      this.topicFilters.status = 'showModerated';
      this.PublicTopicService.setParam('showModerated', true)
    } else {
      this.topicFilters.status = status || 'all';
      this.PublicTopicService.setParam('statuses', [status]);
    }
  }

  setCategory(category: string) {
    this.topicFilters.category = category;
    if (category && category === 'all') {
      category = '';
    }
    this.allTopics$ = [];
    this.PublicTopicService.setParam('offset', 0)
    this.PublicTopicService.setParam('categories', [category]);
  }

  setCountry(country: string) {
    if (typeof country !== 'string') {
      country = '';
    }

    this.countrySearch$.next(country);
    this.countrySearch = country;
    this.allTopics$ = [];
    this.topicFilters.country = country;
    this.PublicTopicService.setParam('offset', 0);
    this.PublicTopicService.setParam('country', country);
    this.PublicTopicService.loadItems();
  }

  setLanguage(language: string) {
    if (typeof language !== 'string') {
      language = '';
    }
    this.languageSearch$.next(language);
    this.languageSearch = language;
    this.allTopics$ = [];
    this.topicFilters.language = language;
    this.PublicTopicService.setParam('offset', 0)
    this.PublicTopicService.setParam('language', language || null);
    this.PublicTopicService.loadItems();
  }

  ngOnInit(): void {
  }

  loadPage(page: any) {
    this.allTopics$ = [];
    this.PublicTopicService.loadPage(page);
  }

  showMobileOverlay () {
    const filtersShow = Object.entries(this.mobileFilters).find(([key, value]) => {
      return value === true;
    })
    if (filtersShow) return true;

    return false;
  }

  doClearFilters() {
    this.setStatus(this.FILTERS_ALL);
    this.setCategory(this.FILTERS_ALL);
    this.setCountry('');
    this.setLanguage('');
    this.topicFilters.country = this.FILTERS_ALL;
    this.topicFilters.language = this.FILTERS_ALL;

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  isFilterApplied() {
    return this.topicFilters.category !== this.FILTERS_ALL || this.topicFilters.status !== this.FILTERS_ALL || this.topicFilters.country !== '' || this.topicFilters.country !== '';
  };

  //mew

  doSearch(search: string) {
    this.searchString$.next(search);
  }
}
