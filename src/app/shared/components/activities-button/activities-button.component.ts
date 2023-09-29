import { Component, Input } from '@angular/core';
import { catchError, tap, of } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'activities-button',
  templateUrl: './activities-button.component.html',
  styleUrls: ['./activities-button.component.scss']
})
export class ActivitiesButtonComponent {
  @Input() groupId?:string;
  @Input() topicId?:string;
  newActivities: number = 0;
  unreadActivitiesCount$: any;
  constructor(
    public app: AppService,
    private ActivityService: ActivityService
  ) {
    console.log(this.topicId);
  }

  ngOnInit(): void {
    this.unreadActivitiesCount$ = this.ActivityService.getUnreadActivities({groupId: this.groupId, topicId: this.topicId}).pipe(tap((count: number) => {
      this.newActivities = 0;
      if (count) this.newActivities = count
    }),
    catchError((error:any) => {
      console.error('unreadActivitiesCount$ error', error);
      if (error.status === 404) {
        this.newActivities = 0;
        return of(0);
      }
      return error
    }));
  }
}
