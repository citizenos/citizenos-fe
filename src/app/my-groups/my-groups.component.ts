import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { tap, switchMap, combineLatest, Observable, of, BehaviorSubject } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';
import { ActivityService } from '../services/activity.service';
import { animate, group, state, style, transition, keyframes, trigger } from '@angular/animations';

@Component({
  selector: 'my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        'maxHeight': '300px',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        'maxHeight': '50px',
        'overflowY': 'hidden',
        transition: '0.2s ease-in-out max-height'
      }))
  ])]
})
export class MyGroupsComponent implements OnInit {
  public wWidth = window.innerWidth;
  groupId = <string | null>null;
  groups$: Observable<Group[] | any[]> = of([]);
  allGroups$: Group[] = [];
  newActivities: number = 0;
  unreadActivitiesCount$: any;
  visibility = ['all'].concat(Object.values(this.GroupService.VISIBILITY));
  categories = ['all', 'democracy'];
  searchInput = '';
  searchString$ = new BehaviorSubject('');
  moreFilters = false;

  constructor(
    public app: AppService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public GroupService: GroupService,
    private router: Router,
    TranslateService: TranslateService,
    ActivityService: ActivityService) {
    this.unreadActivitiesCount$ = ActivityService.getUnreadActivities().pipe(tap((count: number) => {
      this.newActivities = 0;
      if (count) this.newActivities = count
    }));
    this.groups$ = combineLatest([this.route.queryParams, this.searchString$]).pipe(
      switchMap(([queryParams, search]) => {
        console.log(search);
        GroupService.reset();
        if (search) {
          GroupService.setParam('search', search);
        }
        Object.entries(queryParams).forEach((param) => {
          GroupService.setParam(param[0], param[1]);
        })
        return GroupService.loadItems();
      }
      ));
  }

  doSearch(search: string) {
    this.searchString$.next(search);
  }

  ngOnInit(): void {
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
      if (g.length === 3 && g[2] === 'groups') return false

      return true;
    }

    return false;
  }

}
