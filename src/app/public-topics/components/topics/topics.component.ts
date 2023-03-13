import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { TopicService } from 'src/app/services/topic.service';
import { PublicTopicService } from 'src/app/services/public-topic.service';
import { map, tap, switchMap, of, Observable, Subject, concatWith, } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { UntypedFormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'public-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  public FILTERS_ALL = 'all';
  topicFilters = {
    category: this.FILTERS_ALL,
    status: this.FILTERS_ALL
  };


  tabSelected = 'categories';
  categories$ = Object.keys(this.Topic.CATEGORIES);

  statuses$ = Object.keys(this.Topic.STATUSES);
  allTopics$: Topic[] = [];
  topics$ = of(<Topic[]>[]);
  wWidth = window.innerWidth;
  destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private Topic: TopicService, public PublicTopicService: PublicTopicService, private FormBuilder: UntypedFormBuilder, public app: AppService) {
    this.PublicTopicService.reset();
    this.topics$ = this.PublicTopicService.loadItems().pipe(map(
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
}
