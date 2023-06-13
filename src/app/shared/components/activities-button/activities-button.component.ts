import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'activities-button',
  templateUrl: './activities-button.component.html',
  styleUrls: ['./activities-button.component.scss']
})
export class ActivitiesButtonComponent {

  newActivities: number = 0;
  unreadActivitiesCount$: any;
  constructor(
    public app: AppService,
    ActivityService: ActivityService
  ) {
    this.unreadActivitiesCount$ = ActivityService.getUnreadActivities().pipe(tap((count: number) => {
      this.newActivities = 0;
      if (count) this.newActivities = count
    }));
  }
}
