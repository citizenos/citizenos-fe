import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, map, switchMap } from 'rxjs/operators';
import { UserTopicService } from 'src/app/services/user-topic.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  topics$;
  public filters;
  public topicFilters = [
    {
      id: 'all',
      name: 'VIEWS.MY.FILTERS.SHOW_ALL_MY_TOPICS'
    },
    {
      name: 'VIEWS.MY.FILTERS.SHOW_ONLY',
      children: [
        {
          id: 'public',
          name: 'VIEWS.MY.FILTERS.MY_PUBLIC_TOPICS'
        },
        {
          id: 'private',
          name: 'VIEWS.MY.FILTERS.MY_PRIVATE_TOPICS'
        },
        {
          id: 'haveVoted',
          name: 'VIEWS.MY.FILTERS.TOPICS_I_HAVE_VOTED'
        },
        {
          id: 'haveNotVoted',
          name: 'VIEWS.MY.FILTERS.TOPICS_I_HAVE_NOT_VOTED'
        },
        {
          id: 'iCreated',
          name: 'VIEWS.MY.FILTERS.TOPICS_I_CREATED'
        },
        {
          id: 'inProgress',
          name: 'VIEWS.MY.FILTERS.TOPICS_IN_PROGRESS'
        },
        {
          id: 'voting',
          name: 'VIEWS.MY.FILTERS.TOPICS_IN_VOTING'
        },
        {
          id: 'followUp',
          name: 'VIEWS.MY.FILTERS.TOPICS_IN_FOLLOW_UP'
        },
        {
          id: 'closed',
          name: 'VIEWS.MY.FILTERS.TOPICS_CLOSED'
        },
        {
          id: 'pinnedTopics',
          name: 'VIEWS.MY.FILTERS.TOPICS_PINNED'
        },
        {
          id: 'showModerated',
          name: 'VIEWS.MY.FILTERS.TOPICS_MODERATED'
        }
      ]
    },
    {
      id: 'grouped',
      name: 'VIEWS.MY.FILTERS.TOPICS_ORDERED_BY_GROUPS'
    }
  ];
  constructor(public UserTopicService: UserTopicService, public route: ActivatedRoute, private router: Router) {
    this.topics$ = this.route.queryParams.pipe(
      switchMap((queryParams) => {
        console.log(queryParams);
        this.UserTopicService.filterTopics(queryParams['filter']);
        return this.route.paramMap.pipe(switchMap((params) => {
          console.log(params);
          return this.UserTopicService.topics$.pipe(map((items) => {
            if (!items.length) {
              this.router.navigate(['my','topics'], {queryParams});
            } else {
              const inlist = items.map(item => item.id).find((id) => id === params.get('topicId'));
              if (!inlist) {
                this.router.navigate(['my','topics', items[0].id], {queryParams});
              }
            }
            return items;
          }))
        }))
      })
    );
    //find(this.topicFilters, { id: filterParam }) || chain(this.topicFilters).map('children').flatten().find({ id: filterParam }).value()
    this.filters = {
      items: this.topicFilters,
      selected: this.topicFilters[0]
    };
  }

  onSelect(id: string) {
   // this.UserTopicService.filterTopics(id);
    this.router.navigate([], { relativeTo: this.route, queryParams: {filter:id}});
  }

}
