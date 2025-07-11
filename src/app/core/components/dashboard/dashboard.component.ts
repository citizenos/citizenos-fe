import { CookieService } from 'ngx-cookie-service';
import { OnboardingComponent } from './../onboarding/onboarding.component';
import { DialogService } from 'src/app/shared/dialog';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { AppService } from '@services/app.service';
import { AuthService } from '@services/auth.service';
import { UserTopicService } from '@services/user-topic.service';
import { PublicTopicService } from '@services/public-topic.service';
import { PublicGroupService } from '@services/public-group.service';
import { TranslateService } from '@ngx-translate/core';

import { GroupService } from '@services/group.service';
import { NewsService } from '@services/news.service';
import { of, tap, Observable, map } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { Group } from 'src/app/interfaces/group';
import { News } from 'src/app/interfaces/news';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent {
  // Observable properties with proper typing
  readonly groups$: Observable<Group[]> = of([]);
  readonly topics$: Observable<Topic[]> = of([]);
  readonly publictopics$: Observable<Topic[]> = of([]);
  readonly publicgroups$: Observable<Group[]> = of([]);
  readonly news$: Observable<News[]> = of([]);

  // Convert to signals for better performance
  readonly showNoEngagements = signal(false);
  readonly showPublic = signal(true);
  readonly showCreate = signal(false);
  readonly wWidth = signal(window.innerWidth);

  constructor(
    public readonly auth: AuthService,
    public readonly app: AppService,
    public readonly translate: TranslateService,
    private readonly UserTopicService: UserTopicService,
    private readonly PublicTopicService: PublicTopicService,
    private readonly PublicGroupService: PublicGroupService,
    private readonly GroupService: GroupService,
    private readonly NewsService: NewsService,
    private readonly dialog: DialogService,
    private readonly CookieService: CookieService
  ) {
    this.groups$ = this.GroupService.loadItems();
    this.news$ = this.NewsService.get().pipe(
      map((news) => {
        news.forEach((item: News) => {
          const elem = document.createElement('div');
          elem.innerHTML = item.content;
          const img = elem.querySelector('img');
          if (img) {
            item.imageUrl = img.src;
          }
        });

        return news;
      })
    );
    this.topics$ = this.UserTopicService.loadItems().pipe(
      tap((topics) => {
        if (topics.length === 0) {
          this.showPublic.set(true);
          this.showNoEngagements.set(true);
        }
      })
    );
    this.publictopics$ = this.PublicTopicService.loadItems();
    this.publicgroups$ = this.PublicGroupService.loadItems();
    this.app.mobileNavBox = true;
  }

  trackByTopic(index: number, element: Topic | Group): number {
    return typeof element.id === 'string' ? parseInt(element.id, 10) : element.id;
  }

  ngAfterViewInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (!this.CookieService.get('show-dashboard-tour')){
      setTimeout(() => {
        this.dialog.closeAll();
        const onBoarding = this.dialog.open(OnboardingComponent);
        this.app.mobileTutorial = true;
        onBoarding.afterClosed().subscribe(() => {
          this.CookieService.set('show-dashboard-tour', 'true', 36500); this.app.mobileTutorial = false
        });
      });
    }
  }

  showCreateMenu(): void {
    this.showCreate.update(current => !current);
  }

  ngOnDestroy(): void {
    this.app.mobileNavBox = false;
  }
}
