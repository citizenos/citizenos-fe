import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TopicService } from 'src/app/services/topic.service';
import { PublicTopicService } from 'src/app/services/public-topic.service';
import { PublicGroupService } from 'src/app/services/public-group.service';
import { GroupService } from 'src/app/services/group.service';
import { of, Subject, Observable } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { Group } from 'src/app/interfaces/group';
import { GroupCreateComponent } from 'src/app/group/components/group-create/group-create.component';
import { MatDialog } from '@angular/material/dialog';
import { TopicCreateComponent } from 'src/app/topic/components/topic-create/topic-create.component';
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

  constructor(
    private dialog: MatDialog,
    private AuthService: AuthService,
    private route: ActivatedRoute,
    private Topic: TopicService,
    private GroupService: GroupService,
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
    topicsParams.limit = 8;
    this.topics$ = this.PublicTopicService.loadItems();
    const groupsParams = this.PublicGroupService.params$.value;
    groupsParams.limit = 8;
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
    this.dialog.open(GroupCreateComponent, {
      data: {
        visibility: this.GroupService.VISIBILITY.private
      }
    })
  }
  createNewTopic() {
    this.dialog.open(TopicCreateComponent, {
      data: {
        visibility: this.GroupService.VISIBILITY.private
      }
    })
  }
}
