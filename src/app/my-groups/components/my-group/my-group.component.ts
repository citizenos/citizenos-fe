import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, take, map, switchMap, BehaviorSubject, tap, of } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { Group } from 'src/app/interfaces/group';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { GroupMemberUserService } from 'src/app/services/group-member-user.service';

@Component({
  selector: 'app-my-group',
  templateUrl: './my-group.component.html',
  styleUrls: ['./my-group.component.scss']
})
export class MyGroupComponent implements OnInit {
  @ViewChild('userListEl') userListEl?: ElementRef;
  @ViewChild('topicListEl') topicListEl?: ElementRef;

  group$: Observable<Group>;
  //Sections
  generalInfo = true;
  voteResults = false;
  topicList = false;
  topicListSearch = false;
  userList = false;
  userListSearch = false;
  //Sections end
  activities = false;
  wWidth = window.innerWidth;

  memberTopics$ = of(<any[]>[]);
  memberUsers$ = of(<any[]>[]);
  memberInvites$ = of(<any[]>[]);

  latestTopic?:Topic;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private GroupService: GroupService,
    public GroupMemberTopicService: GroupMemberTopicService,
    public GroupMemberUserService: GroupMemberUserService,
    ) {
    this.group$ = this.route.params.pipe(
      switchMap((params) => {
        return this.GroupService.get(params['groupId']);
      })
    );
    this.memberTopics$ = this.route.params.pipe(
      switchMap((params) => {
        this.GroupMemberTopicService.params.groupId = params['groupId'];
        this.GroupMemberTopicService.setParam('groupId', params['groupId']);
        return this.GroupMemberTopicService.loadItems()
      }));
    this.memberUsers$ = this.route.params.pipe(
        switchMap((params) => {
          this.GroupMemberUserService.params.groupId = params['groupId'];
          this.GroupMemberUserService.setParam('groupId', params['groupId']);
          return this.GroupMemberUserService.loadItems()
        }));
  }

  ngOnInit(): void {
  }

  isPrivate (group: Group) {
    return this.GroupService.isPrivate(group)
  }

  canUpdate(group: Group) {
    return this.GroupService.canUpdate(group)
  }

  canDelete(group: Group) {
    return this.GroupService.canDelete(group)
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  viewMemberUsers() {
    this.userList = true;
    this.scroll(this.userListEl?.nativeElement);
  }

  viewMemberTopics() {
    this.topicList = true;
    this.scroll(this.topicListEl?.nativeElement);
  }
}
