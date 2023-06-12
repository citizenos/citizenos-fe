import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { tap, switchMap, combineLatest, Observable, of } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  public wWidth = window.innerWidth;
  groupId = <string | null>null;
  groups$: Observable<Group[] | any[]> = of([]);
  allGroups$: Group[] = [];
  newActivities: number = 0;
  unreadActivitiesCount$: any;
  visibility = ['all'].concat(Object.values(this.GroupService.VISIBILITY));
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
    this.groups$ = combineLatest([this.route.queryParams, this.route.params]).pipe(
      switchMap(([queryParams, params]) => {
        GroupService.reset();
        return GroupService.loadItems();
      }
      ));
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
