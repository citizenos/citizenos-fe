import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { TopicService } from 'src/app/services/topic.service';
import { PublicTopicService } from 'src/app/services/public-topic.service';
import { switchMap, map, of, Subject, BehaviorSubject, combineLatest, } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { trigger, state, style } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
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
  topics$ = of(<Topic[]| any[]>[]);
  //new
  public FILTERS_ALL = 'all';
  topicFilters = {
    category: this.FILTERS_ALL,
    status: this.FILTERS_ALL
  };

  mobile_filters = {
    category: false,
    status: false,
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
        if (search) {
          PublicTopicService.setParam('search', search);
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
  }

  trackByFn(index: number, element: any) {
    return element.id;
  }

  setStatus(status: string) {
    this.topicFilters.status = status;
    if (status && status === 'all') {
      status = '';
    }
    this.allTopics$ = [];
    this.PublicTopicService.setParam('offset',0)
    this.PublicTopicService.setParam('statuses', [status]);
  }

  setCategory(category: string) {
    console.log(category)
    this.topicFilters.category = category ;
    if (category && category === 'all') {
      category = '';
    }
    this.allTopics$ = [];
    this.PublicTopicService.setParam('offset',0)
    this.PublicTopicService.setParam('categories', [category]);
  }

  ngOnInit(): void {
  }

  doClearFilters() {
    this.setStatus(this.FILTERS_ALL);
    this.setCategory(this.FILTERS_ALL);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  isFilterApplied() {
    return this.topicFilters.category !== this.FILTERS_ALL || this.topicFilters.status !== this.FILTERS_ALL;
  };

  //mew

  doSearch(search: string) {
    this.searchString$.next(search);
  }
}
