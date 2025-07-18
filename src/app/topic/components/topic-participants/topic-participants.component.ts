import { Component, OnInit, Inject } from '@angular/core';
import { DialogService, DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicMemberUserService } from '@services/topic-member-user.service';
import { TopicInviteUserService } from '@services/topic-invite-user.service';
import { TopicMemberGroupService } from '@services/topic-member-group.service';
import { TopicService } from '@services/topic.service';
import { of, take, tap, switchMap } from 'rxjs';
import { TopicMemberUser } from 'src/app/interfaces/user';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
export interface TopicParticipantsData {
  topic: Topic
};

@Component({
  selector: 'app-topic-participants',
  templateUrl: './topic-participants.component.html',
  styleUrls: ['./topic-participants.component.scss'],
  standalone: false
})
export class TopicParticipantsComponent implements OnInit {

  activeTab = 'participants';
  topic: Topic;
  memberGroups$ = of(<any[]>[]);
  memberUsers$ = of(<any[]>[]);
  memberUsers = <any[]>[];
  memberInvites$ = of(<any[]>[]);
  LEVELS = Object.keys(this.TopicService.LEVELS)
  constructor(
    private dialog: DialogService,
    @Inject(DIALOG_DATA) public data: TopicParticipantsData,
    public TopicMemberUserService: TopicMemberUserService,
    public TopicInviteUserService: TopicInviteUserService,
    public TopicMemberGroupService: TopicMemberGroupService,
    private TopicService: TopicService
  ) {
    this.topic = data.topic;
    this.memberGroups$ = TopicMemberGroupService.loadItems();
    this.memberUsers$ = TopicMemberUserService.loadItems().pipe(
      tap((members:any) => this.memberUsers = members)
    );
    this.memberInvites$ = TopicInviteUserService.loadItems();
  }

  ngOnInit(): void {
    this.TopicMemberGroupService.setParam('topicId', this.topic.id);
    this.TopicMemberUserService.setParam('topicId', this.topic.id);
    this.TopicInviteUserService.setParam('topicId', this.topic.id);
  }

  canUpdate() {
    return this.TopicService.canUpdate(this.topic);
  }

  updateAllMemberLevels(level: string) {
    this.memberUsers.forEach((member: TopicMemberUser) => {
      this.doUpdateMemberUser(member, level);
    });
  };

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

  doDeleteMemberUser(member: TopicMemberUser) {
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
  template: '',
  standalone: false
})
export class TopicParticipantsDialogComponent implements OnInit {

  constructor(dialog: DialogService, router: Router, route: ActivatedRoute, TopicService: TopicService, @Inject(DIALOG_DATA) data: any, curDialog: DialogRef<TopicParticipantsDialogComponent>) {
    if (data.topic) {
      const manageDialog = dialog.open(TopicParticipantsComponent, { data: { topic: data.topic } });
      manageDialog.afterClosed().subscribe(() => {
        curDialog.close();
      })
    } else {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        const manageDialog = dialog.open(TopicParticipantsComponent, { data: { topic } });
        manageDialog.afterClosed().subscribe(() => {
          curDialog.close();
          router.navigate(['../'], { relativeTo: route });
        })
      })
    }

  }

  ngOnInit(): void {
  }

}
