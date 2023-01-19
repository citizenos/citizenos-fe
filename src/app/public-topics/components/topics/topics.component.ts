import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { PublicTopicService } from 'src/app/services/public-topic.service';
import { map, tap, switchMap, of,Observable, Subject, concatWith, } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'public-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  topicFilters = new FormGroup({
    category: new FormControl('all'),
    status: new FormControl('all')
  });

  public FILTERS_ALL = 'all';

  categories$ = Object.keys(this.Topic.CATEGORIES);

  statuses$ = Object.keys(this.Topic.STATUSES);
  allTopics$: Topic[] = [];
  topics$ = of(<Topic[]>[]);
  wWidth = window.innerWidth;
  destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private Topic: TopicService, public PublicTopicService: PublicTopicService, private FormBuilder:FormBuilder) {
    this.PublicTopicService.reset();
    this.topics$ = this.PublicTopicService.loadItems().pipe(map(
      (newtopics:any) => {
        this.allTopics$ = this.allTopics$.concat(newtopics);
        return this.allTopics$;
      }
    ));
  }

  trackByFn (index: number, element: any) {
    return element.id;
  }

  setStatus (status: string) {
    this.topicFilters.patchValue({status: status});
    if (status && status === 'all') {
      status = '';
    }
    this.allTopics$ = [];
    this.PublicTopicService.setParam('statuses', status);
  }

  setCategory (category: string) {
    this.topicFilters.patchValue({category: category});
    if (category && category === 'all') {
      category = '';
    }
    this.allTopics$ = [];
    this.PublicTopicService.setParam('category', category);
  }

  ngOnInit(): void {
  }

  doClearFilters () {
    this.topicFilters.reset({
      category: 'all',
      status: 'all'
    });

    this.setStatus('');
    this.setCategory('');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
