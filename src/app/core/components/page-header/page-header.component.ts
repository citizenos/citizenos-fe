import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserTopicService } from 'src/app/services/user-topic.service';
import { PublicTopicService } from 'src/app/services/public-topic.service';
import { ActivityFeedComponent } from '../activity-feed/activity-feed.component';
import { TranslateService } from '@ngx-translate/core';
import { ActivityService } from 'src/app/services/activity.service';

import { GroupService } from 'src/app/services/group.service';
import { of, tap, Subject, Observable } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { Group } from 'src/app/interfaces/group';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {

  constructor(
    public auth: AuthService,
    public app: AppService,
    public translate: TranslateService) {

  }
}
