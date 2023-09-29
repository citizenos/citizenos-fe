import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(public ActivityService: ActivityService, @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  filterActivities(filter: string) {
    this.allActivities$ = [];
    this.ActivityService.reset();
    this.ActivityService.setParam('include', filter)
  }
  ngOnInit(): void {
    this.ActivityService.reset();
    if (this.data?.groupId) {
      this.ActivityService.setParam('groupId', this.data.groupId);
    }
    if (this.data?.topicId) {
      console.log(this.data.topicId)
      this.ActivityService.setParam('topicId', this.data.topicId);
    }
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

  loadMore(event: any) {
    if ((event.target.scrollTop + event.target.offsetHeight) >= event.target.scrollHeight) {
      this.ActivityService.loadMore();
    }
  }
}
