import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @Input() activitygroup!: any;
  constructor(private Translate: TranslateService, private ActivityService: ActivityService) { }

  ngOnInit(): void {
  }

  keyCounter(objIn: any) {
    if (typeof objIn === 'object') {
      return Object.keys(objIn).length;
    }

    return objIn?.length;
  };
  activityRedirect(activity: any) {
    console.log(activity, 'shouldredirects')
    //return this.sActivity.handleActivityRedirect(activity);
  };

  translateGroup(key: string, group: any) {
    const values = group[0].values;
    values.groupCount = group.length;
    if (key.indexOf('USERACTIVITYGROUP') === -1) {
      values.groupCount--;
    }

    return this.Translate.instant(key.split(':')[0], values);
  };
  showActivityUpdateVersions(activity: any) {
    return this.ActivityService.showActivityUpdateVersions(activity);
  };

  showActivityDescription(activity:any) {
    return this.ActivityService.showActivityDescription(activity);
  };
}
