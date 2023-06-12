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
import { GroupCreateComponent } from 'src/app/group/components/group-create/group-create.component';
import { MatDialog } from '@angular/material/dialog';
import { TopicCreateComponent } from 'src/app/topic/components/topic-create/topic-create.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  groups$: Observable<Group[] | any[]> = of([]);
  topics$: Observable<Topic[] | any[]> = of([]);
  publictopics$: Observable<Topic[] | any[]> = of([]);
  showNoEngagements = false;

  constructor(
    private dialog: MatDialog,
    public auth: AuthService,
    public app: AppService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private UserTopicService: UserTopicService,
    private PublicTopicService: PublicTopicService,
    private GroupService: GroupService,
    ) {
    this.groups$ = this.GroupService.loadItems().pipe(
      tap((groups) => console.log(groups))
    );
    this.topics$ = this.UserTopicService.loadItems().pipe(
      tap((topics) => {
        if (topics.length === 0) {
          this.showNoEngagements = true;
        }
      })
    );
    this.publictopics$ = this.PublicTopicService.loadItems();
  }

  trackByTopic(index: number, element: any) {
    return element.id;
  }
}
