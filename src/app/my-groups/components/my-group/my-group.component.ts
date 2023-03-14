import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, take, map, switchMap, BehaviorSubject, tap, of, catchError } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { Group } from 'src/app/interfaces/group';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { GroupMemberUserService } from 'src/app/services/group-member-user.service';
import { GroupInviteUserService} from 'src/app/services/group-invite-user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { GroupInviteComponent } from 'src/app/group/components/group-invite/group-invite.component';
import { CreateGroupTopicComponent } from 'src/app/group/components/create-group-topic/create-group-topic.component';
import { GroupAddTopicsComponent } from 'src/app/group/components/group-add-topics/group-add-topics.component';

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

  latestTopic?: Topic;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private AuthService: AuthService,
    private GroupService: GroupService,
    public GroupMemberTopicService: GroupMemberTopicService,
    public GroupMemberUserService: GroupMemberUserService,
    public GroupInviteUserService: GroupInviteUserService
  ) {
    this.group$ = this.route.params.pipe(
      switchMap((params) => {
        return this.GroupService.get(params['groupId'])
      }),
      catchError((err:any) => {
        console.log(err);
        if (['401', '403', '404'].indexOf(err.status))
          this.router.navigate(['error/' + err.status])
          return of(err);
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
    this.memberInvites$ = this.route.params.pipe(
        switchMap((params) => {
          this.GroupInviteUserService.params.groupId = params['groupId'];
          this.GroupInviteUserService.setParam('groupId', params['groupId']);
          return this.GroupInviteUserService.loadItems()
        }));
  }

  ngOnInit(): void {
  }

  isPrivate(group: Group) {
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

  leaveGroup(group: Group) {
    const leaveDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_TXT_ARE_YOU_SURE_CONTINUE',
        points: ['MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_TXT_ARE_YOU_SURE'],
        confirmBtn: 'MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_MEMBER_USER_LEAVE_CONFIRM_BTN_NO'
      }
    });

    leaveDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.GroupMemberUserService
          .delete({ groupId: group.id, userId: this.AuthService.user.value.id })
          .subscribe((result) => {
            console.log(result);
          });
      }
    });
  }

  deleteGroup(group: Group) {
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.GROUP_DELETE_CONFIRM_HEADING',
        title: 'MODALS.GROUP_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.GROUP_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.GROUP_DELETE_CONFIRM_TXT_GROUP_DELETED', 'MODALS.GROUP_DELETE_CONFIRM_TXT_LOSE_ACCESS'],
        confirmBtn: 'MODALS.GROUP_DELETE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_DELETE_CONFIRM_BTN_NO'
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.GroupService.delete(group)
          .pipe(take(1))
          .subscribe((res) => {
            this.GroupService.reset();
            this.router.navigate(['../'], { relativeTo: this.route });
          })
      }
    });
  }

  shareGroupDialog(group: Group) {
    const inviteDialog = this.dialog.open(GroupInviteComponent, { data: { group: group } });
    inviteDialog.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  createTopicDialog(group: Group) {
    this.dialog.open(CreateGroupTopicComponent, {
      data: {
        group: group
      }
    });
  }

  addTopicDialog(group: Group) {
    this.dialog.open(GroupAddTopicsComponent, {
      data: {
        group: group
      }
    });
  }

  doToggleMemberTopicList () {
    this.topicList = !this.topicList;
  }
}
