import { Component, OnInit } from '@angular/core';
import { map, tap, of } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service'
@Component({
  selector: 'activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss']
})
export class ActivityFeedComponent implements OnInit {
  unreadActivitiesCount = 0;
  allActivities$: any[] = [];
  activities$ = of(<any[]>[]);

  constructor(public ActivityService: ActivityService) {
    this.ActivityService.reset();
    this.activities$ = this.ActivityService.loadItems().pipe(
      tap((res: any) => {
        if (res.length) {
          this.ActivityService.hasMore$.next(true);
        } else {
          this.ActivityService.hasMore$.next(false);
        }
      }),
      map(
        (newActivities: any) => {
          this.allActivities$ = this.allActivities$.concat(newActivities);
          if (this.allActivities$.length < 10 && newActivities.length) {
            this.ActivityService.loadMore();
          }
          return this.allActivities$;
        }
      ));
  }

  filterActivities(filter: string) {
    this.allActivities$ = [];
    this.ActivityService.reset();
    this.ActivityService.setParam('include', filter)
  }
  ngOnInit(): void {
  }

  loadMore(event: any) {
    if ((event.target.scrollTop + event.target.offsetHeight) >= event.target.scrollHeight) {
      this.ActivityService.loadMore();
    }
  }
}
