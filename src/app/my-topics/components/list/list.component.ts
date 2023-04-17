import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { tap, map, switchMap, combineLatest } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AuthService } from 'src/app/services/auth.service';
import { UserTopicService } from 'src/app/services/user-topic.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  topics$;
  allTopics$: Topic[] = [];
  topicId = <string | null>null;
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

  public wWidth = window.innerWidth;

  constructor(public UserTopicService: UserTopicService, public route: ActivatedRoute, private router: Router, private Auth: AuthService, TranslateService: TranslateService) {
    this.topics$ = combineLatest([this.route.queryParams, this.route.params]).pipe(
      switchMap(([queryParams, params]) => {
        this.topicId = params['topicId'];
        this.UserTopicService.reset();
        const filter = queryParams['filter'];
        this.setFilter(filter)
        return this.UserTopicService.loadItems().pipe(map(
          (newtopics: any) => {
            if (!newtopics.length) {
              this.router.navigate([TranslateService.currentLang, 'my', 'topics'], { queryParams });
            } else if (!params['topicId'] && this.wWidth > 750) {
              this.router.navigate([TranslateService.currentLang, 'my', 'topics', newtopics[0].id], { queryParams });
            }

            return newtopics;
          }))
      }
      ));

    this.filters = {
      items: this.topicFilters,
      selected: this.topicFilters[0]
    };
  }

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
          param = 'creatorId'; value = this.Auth.user.value.id;
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
  }

  onSelect(id: string) {
    // this.UserTopicService.filterTopics(id);
    this.router.navigate([], { relativeTo: this.route, queryParams: { filter: id } });
  }

  menuHidden() {
    if (window.innerWidth <= 750) {
      const parsedUrl = this.router.parseUrl(this.router.url);
      const outlet = parsedUrl.root.children[PRIMARY_OUTLET];
      const g = outlet?.segments.map(seg => seg.path) || [''];
      if (g.length === 3 && g[2] === 'topics') return false

      return true;
    }

    return false;
  }

}
