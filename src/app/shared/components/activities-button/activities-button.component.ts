import { Component, Input } from '@angular/core';
import { catchError, tap, map, of, Observable, switchMap } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'activities-button',
  templateUrl: './activities-button.component.html',
  styleUrls: ['./activities-button.component.scss']
})
export class ActivitiesButtonComponent {
  @Input() groupId?: string;
  @Input() topicId?: string;
  count = <any>0;
  wWidth = window.innerWidth;
  unreadActivitiesCount$: Observable<any> = of(0);
  constructor(
    public app: AppService,
    private ActivityService: ActivityService,
    private auth: AuthService
  ) {
    this.unreadActivitiesCount$ = this.auth.loggedIn$.pipe(switchMap((loggedIn: any) => {
      if (loggedIn) {
        return this.ActivityService.getUnreadActivities({ groupId: this.groupId, topicId: this.topicId });
      }
      return of(0);
    }),
    tap((count) => {
      this.count = count;
    }));
  }

  ngOnInit(): void { }
}
