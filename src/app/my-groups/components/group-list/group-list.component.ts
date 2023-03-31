import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap, combineLatest } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  public wWidth = window.innerWidth;
  groups$;
  allGroups$: Group[] = [];

  constructor(private route: ActivatedRoute, public GroupService: GroupService, private router: Router, TranslateService: TranslateService) {
    this.groups$ = combineLatest([this.route.queryParams, this.route.params]).pipe(
      switchMap(([queryParams, params]) => {
        GroupService.reset();
        return GroupService.loadItems().pipe(map(
          (newgroups: any) => {
            if (!newgroups.length) {
              this.router.navigate([TranslateService.currentLang, 'my', 'groups'], { queryParams });

            } else {
              const inlist = newgroups.map((item: any) => item.id).find((id: string) => id === queryParams['groupId']);
              if (!inlist && window.innerWidth > 750) {
                this.router.navigate([TranslateService.currentLang, 'my', 'groups', newgroups[0].id], { queryParams });
              }
            }
            return newgroups;
          }))
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
