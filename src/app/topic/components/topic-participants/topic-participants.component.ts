import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { TopicService } from 'src/app/services/topic.service';
import { of, take, switchMap } from 'rxjs';
import { TopicMemberUser } from 'src/app/interfaces/user';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
export interface TopicParticipantsData {
  topic: Topic
};

@Component({
  selector: 'app-topic-participants',
  templateUrl: './topic-participants.component.html',
  styleUrls: ['./topic-participants.component.scss']
})
export class TopicParticipantsComponent implements OnInit {

  tabSelected = 'participants';
  topic:Topic;
  memberGroups$ = of(<any[]>[]);
  memberUsers$ = of(<any[]>[]);
  memberInvites$ = of(<any[]>[]);
  LEVELS = Object.keys(this.TopicService.LEVELS)
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TopicParticipantsData,
    public TopicMemberUserService: TopicMemberUserService,
    public TopicInviteUserService: TopicInviteUserService,
    public TopicMemberGroupService: TopicMemberGroupService,
    private TopicService: TopicService
    ) {
    this.topic = data.topic;
    this.memberGroups$ = TopicMemberGroupService.loadItems();
    this.memberUsers$ = TopicMemberUserService.loadItems();
    this.memberInvites$ = TopicInviteUserService.loadItems();
  }

  ngOnInit(): void {
    this.TopicMemberGroupService.setParam('topicId', this.topic.id);
    this.TopicMemberUserService.setParam('topicId', this.topic.id);
    this.TopicInviteUserService.setParam('topicId', this.topic.id);
  }

  selectTab(tab: string) {
    this.tabSelected = tab;
  }

  canUpdate () {
    return this.TopicService.canUpdate(this.topic);
  }

  doUpdateMemberUser(member: TopicMemberUser, level: string) {
    if (member.level !== level) {
      member.level = level;
      member.topicId = this.topic.id;
      this.TopicMemberUserService
        .update(member)
        .pipe(take(1))
        .subscribe((res) => {
          return this.TopicMemberUserService.reset();
        });
    }
  };

  doDeleteMemberUser(member:TopicMemberUser) {
  /*  if (member.id === this.AuthService.user.value.id) {
      return this.doLeaveTopic();
    }*/
    const deleteUserDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        confirmBtn: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_YES',
        closeBtn: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_NO'
      }
    });

    deleteUserDialog.afterClosed().subscribe(result => {
      if (result === true) {
        member.topicId = this.topic.id;
        this.TopicMemberUserService.delete({ topicId: this.topic.id, userId: member.userId || member.id })
          .pipe(take(1))
          .subscribe(() => {
            return this.TopicMemberUserService.reset();
          });
      }
    });
  };
}

@Component({
  selector: 'app-topic-participants-dialog',
  template: ''
})
export class TopicParticipantsDialogComponent implements OnInit {

  constructor(dialog: MatDialog, router: Router, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
    .subscribe((topic) => {
      const manageDialog = dialog.open(TopicParticipantsComponent, {data: {topic}});
      manageDialog.afterClosed().subscribe(() => {
        router.navigate(['../'], {relativeTo: route});
      })
    })

  }

  ngOnInit(): void {
  }

}