import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @Input() activitygroup!: any;
  constructor(private Translate: TranslateService, private ActivityService: ActivityService, private sanitized: DomSanitizer) {
  }

  ngOnInit(): void {
  }

  keyCounter(objIn: any) {
    if (typeof objIn === 'object') {
      return Object.keys(objIn).length;
    }

    return objIn?.length;
  };
  activityRedirect(activity: any) {
    return this.ActivityService.handleActivityRedirect(activity);
  };

  translateGroup(key: string, group: any) {
    const values = group[0].values;
    values.groupCount = group.length;
    if (key.indexOf('USERACTIVITYGROUP') === -1) {
      values.groupCount--;
    }

    return this.sanitized.bypassSecurityTrustHtml(this.Translate.instant(key.split(':')[0], values));
  };

  translateActivity(activity: any) {
    return this.sanitized.bypassSecurityTrustHtml(this.Translate.instant(activity.string, activity.values));
  }
  showActivityUpdateVersions(activity: any) {
    return this.ActivityService.showActivityUpdateVersions(activity);
  };

  showActivityDescription(activity:any) {
    return this.ActivityService.showActivityDescription(activity);
  };
  translateVersion(a: any, type: string) {
    let string = 'ACTIVITY_FEED.ACTIVITY_NEW_VERSION';
    if (type == 'new') {
      string = 'ACTIVITY_FEED.ACTIVITY_PREVIOUS_VERSION'
    }
    const translateParams={
      previousValue: (a.values.previousValue?.slice(0,200) + ((a.values.previousValue?.length > 200) ? '...' : '')),
      newValue: (a.values.newValue?.slice(0,200) + ((a.values.newValue?.length > 200) ? '...' : ''))
    };
    return this.sanitized.bypassSecurityTrustHtml(this.Translate.instant(string, translateParams));
  }
}
