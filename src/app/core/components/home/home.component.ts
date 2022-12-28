import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { PublicTopicService } from 'src/app/services/public-topic.service';
import { PublicGroupService } from 'src/app/services/public-group.service';
import { switchMap, map, of, BehaviorSubject, takeUntil, Subject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories$ = Object.keys(this.Topic.CATEGORIES);
  statuses$ = Object.keys(this.Topic.STATUSES);

  topics$ = this.PublicTopicService.topics$;
  groups$ = this.PublicGroupService.groups$;
  wWidth = window.innerWidth;
  destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private Topic: TopicService, public PublicTopicService: PublicTopicService, public PublicGroupService: PublicGroupService) {
  }

  trackByTopic (index: number, element: any) {
    return element.id;
  }


  ngOnInit(): void {
    const topicsParams = this.PublicTopicService.params$.value;
    topicsParams.limit = 8;
    this.PublicTopicService.params$.next(topicsParams);

    const groupsParams = this.PublicGroupService.params$.value;
    groupsParams.limit = 8;
    this.PublicGroupService.params$.next(groupsParams);
  }

  goToPage (url: string) {
    window.location.href = url;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
