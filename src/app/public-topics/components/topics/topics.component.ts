import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { PublicTopicService } from 'src/app/services/public-topic.service';
import { switchMap, map, of, BehaviorSubject, takeUntil, Subject, combineLatest } from 'rxjs';

@Component({
  selector: 'public-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  public FILTERS_ALL = 'all';
  category$;
  status$ = new BehaviorSubject('all');

  categories$ = Object.keys(this.Topic.CATEGORIES);

  statuses$ = Object.keys(this.Topic.STATUSES);

  topics$ = this.PublicTopicService.topics$;
  wWidth = window.innerWidth;
  destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private Topic: TopicService, public PublicTopicService: PublicTopicService) {
    this.category$ = this.route.params.pipe(
      switchMap((routeParams) => {
        const category = routeParams['category'];
        if(this.categories$.indexOf(category) > -1) {
          return of(category);
        }
        return of('all');
      })
    );

    combineLatest([this.status$, this.category$]).pipe(
      map(([category, status]) => {
        this.PublicTopicService.setCategory(category);
        this.PublicTopicService.setStatus(status);
      })
    );

    this.status$.pipe(
      map((status) => {
        this.PublicTopicService.setStatus(status);
      })
    );


  }

  trackByFn (index: number, element: any) {
    return element.id;
  }

  doSetCategory (category: string) {
    this.category$ = of(category);
  };

  doSetStatus (status: string) {
    console.log('STATUS', status)
    this.status$.next(status);
  };

  ngOnInit(): void { }

  goToPage (url: string) {
    window.location.href = url;
  }

  doClearFilters () {
    console.log('clear');
    this.doSetCategory('all');
    this.doSetStatus('all');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
