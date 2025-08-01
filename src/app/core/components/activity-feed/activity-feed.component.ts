import { style, transition, trigger, animate, state } from '@angular/animations';
import { Component, OnInit, Input, inject} from '@angular/core';
import { DIALOG_DATA, DialogRef, DialogService } from 'src/app/shared/dialog';
import { map, tap, of } from 'rxjs';
import { ActivityService } from '@services/activity.service'
import { Location } from '@angular/common';
import { AppService } from '@services/app.service';
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
        right: '-100vw'
      })),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('1s')
      ]),
    ]),
  ],
  standalone: false
})
export class ActivityFeedComponent implements OnInit {
  unreadActivitiesCount = 0;
  allActivities$: any[] = [];
  activities$ = of(<any[]>[]);
  show = false;
  feedType = 'global';
  @Input() groupId?: string;
  @Input() topicId?: string;
  @Input() modal?: boolean;
  @Input() dialogRef?: DialogRef<ActivityFeedDialogComponent>;
  constructor(public ActivityService: ActivityService, private readonly location: Location, public dialog: DialogService, public app: AppService) {
    setTimeout(() => {
      this.show = true
    });
  }

  filterActivities(filter: string) {
    this.allActivities$ = [];
    this.ActivityService.reset();
    if (this.groupId) {
      this.feedType = 'group';
      this.ActivityService.setParam('groupId', this.groupId);
    }
    if (this.topicId) {
      this.feedType = 'topic';
      this.ActivityService.setParam('topicId', this.topicId);
    }
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

  close() {
    this.ActivityService.reset();
    this.ActivityService.reloadUnreadItems();
    this.show = false;
    if (!this.modal) {
      this.location.back();
    } else if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
@Component({
  selector: 'activity-feed-dialog',
  templateUrl: './activity-feed-dialog.component.html',
  styleUrls: ['./activity-feed.component.scss'],
  standalone: false
})
export class ActivityFeedDialogComponent extends ActivityFeedComponent {
  public data: any = inject(DIALOG_DATA);
  public dialogItem: any = inject(DialogRef<ActivityFeedComponent>);
}
