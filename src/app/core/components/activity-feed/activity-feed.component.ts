import { style, transition, trigger, animate, state } from '@angular/animations';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, tap, of } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service'
@Component({
  selector: 'activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        right: 0,
      })),
      state('closed', style({
        right: '-300px'
      })),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('1s')
      ]),
    ]),
  ]
})
export class ActivityFeedComponent implements OnInit {
  unreadActivitiesCount = 0;
  allActivities$: any[] = [];
  activities$ = of(<any[]>[]);
  show = false;
  constructor(public ActivityService: ActivityService, @Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<ActivityFeedComponent>) {
    setTimeout(() => {
      this.show = true
    });
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
  close () {
    this.show = false;
    setTimeout(() => {
      this.dialogRef.close();
    }, 500)
  }
}
