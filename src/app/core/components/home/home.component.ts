import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TopicService } from 'src/app/services/topic.service';
import { PublicTopicService } from 'src/app/services/public-topic.service';
import { PublicGroupService } from 'src/app/services/public-group.service';
import { GroupService } from 'src/app/services/group.service';
import { of, Subject, Observable } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { Group } from 'src/app/interfaces/group';
import { MatDialog } from '@angular/material/dialog';
import { TopicCreateComponent } from 'src/app/topic/components/topic-create/topic-create.component';
import { AppService } from 'src/app/services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from 'src/app/services/location.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories$ = Object.keys(this.Topic.CATEGORIES);
  statuses$ = Object.keys(this.Topic.STATUSES);

  topics$: Observable<Topic[] | any[]> = of([]);
  groups$: Observable<Group[] | any[]> = of([]);
  wWidth = window.innerWidth;
  destroy$ = new Subject<boolean>();
  stats$ = this.app.stats();
  constructor(
    private dialog: MatDialog,
    private AuthService: AuthService,
    public app: AppService,
    private location: LocationService,
    private router: Router,
    private Topic: TopicService,
    private GroupService: GroupService,
    public translate: TranslateService,
    private PublicTopicService: PublicTopicService,
    private PublicGroupService: PublicGroupService) {
  }

  trackByTopic(index: number, element: any) {
    return element.id;
  }

  isLoggedIn() {
    return this.AuthService.loggedIn$.value;
  }

  ngOnInit(): void {
    this.PublicTopicService.reset();
    this.PublicGroupService.reset();

    const topicsParams = this.PublicTopicService.params$.value;
    const groupsParams = this.PublicGroupService.params$.value;
    topicsParams.limit = 8;
    groupsParams.limit = 8;
    if (window.innerWidth < 560) {
      topicsParams.limit = 3;
      groupsParams.limit = 3;
    }
    this.PublicTopicService.params$.next(topicsParams);
    this.topics$ = this.PublicTopicService.loadItems();
    this.PublicGroupService.params$.next(groupsParams);
    this.groups$ = this.PublicGroupService.loadItems();
  }

  goToPage(url: string) {
    window.location.href = url;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  createGroup() {
    const createGroupTree = ['/', this.translate.currentLang,'my','groups','create'];
    const tree = this.router.createUrlTree(createGroupTree);

    if (!this.AuthService.loggedIn$.value) {

      const redirectSuccess = this.location.getAbsoluteUrl(this.router.serializeUrl(tree).toString());
      this.app.doShowLogin(redirectSuccess);
      //this.router.navigate(['/', this.translate.currentLang, 'account', 'login'], {queryParams: {redirectSuccess }})
    } else {
      this.router.navigate(createGroupTree);
    }
  }
  createNewTopic() {
    this.dialog.open(TopicCreateComponent, {
      data: {
        visibility: this.GroupService.VISIBILITY.private
      }
    })
  }
}
