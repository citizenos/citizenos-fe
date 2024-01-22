import { style, transition, trigger, animate, state } from '@angular/animations';
import { Component, OnInit, Input, Inject, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';
import { map, tap, of } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service'
import { Location } from '@angular/common';
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
  feedType = 'global';
  @Input() groupId?: string;
  @Input() topicId?: string;
  @Input() modal?: boolean = false;
  constructor(public ActivityService: ActivityService, private location: Location) {
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
    if (this.groupId) {
      this.feedType = 'group';
      this.ActivityService.setParam('groupId', this.groupId);
    }
    if (this.topicId) {
      this.feedType = 'topic';
      this.ActivityService.setParam('topicId', this.topicId);
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
    //this.show = false;
    this.location.back()
  }
}
@Component({
  selector: 'activity-feed-dialog',
  templateUrl: './activity-feed-dialog.component.html',
  styleUrls: ['./activity-feed.component.scss'],
})
export class ActivityFeedDialogComponent extends ActivityFeedComponent {

  @Inject(DIALOG_DATA) public data: any;
  @Inject(DialogRef<ActivityFeedComponent>) private dialogRef!: DialogRef<ActivityFeedComponent>;

 override close () {
    this.show = false;
    setTimeout(() => {
      this.dialogRef.close();
    }, 500)
  }
}
