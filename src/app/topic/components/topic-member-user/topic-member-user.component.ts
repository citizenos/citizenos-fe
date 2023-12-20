import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Topic } from 'src/app/interfaces/topic';
import { TopicMemberUser } from 'src/app/interfaces/user';
import { TopicService } from 'src/app/services/topic.service';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { take } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'topic-member-user',
  templateUrl: './topic-member-user.component.html',
  styleUrls: ['./topic-member-user.component.scss']
})
export class TopicMemberUserComponent implements OnInit {
  @Input() member?: TopicMemberUser | any;
  @Input() topic: Topic | any;
  @Input() fields?: any;

  userLevels = Object.keys(this.TopicService.LEVELS)
  constructor(
    private AuthService: AuthService,
    private dialog: MatDialog,
    private Translate: TranslateService,
    private TopicService: TopicService,
    private TopicMemberUserService: TopicMemberUserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  canUpdate () {
    return this.TopicService.canUpdate(this.topic);
  }

  isVisibleField(field: string) {
    return this.fields?.indexOf(field) > -1
  }

  doUpdateMemberUser(level: any) {
    if (this.member.level !== level) {
      const oldLevel = this.member.level;
      this.member.level = level;
      this.member.topicId = this.topic.id;
      this.TopicMemberUserService
        .update(this.member)
        .pipe(take(1))
        .subscribe((res) => {
          return this.TopicMemberUserService.reset();
        });
    }
  };

  doDeleteMemberUser() {
    if (this.member.id === this.AuthService.user.value.id) {
      return this.doLeaveTopic();
    }
    const deleteUserDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_HEADING',
        description: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        confirmBtn: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_YES',
        closeBtn: 'MODALS.TOPIC_MEMBER_USER_DELETE_CONFIRM_NO'
      }
    });
    deleteUserDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.member.topicId = this.topic.id;
        this.TopicMemberUserService.delete({ topicId: this.topic.id, userId: this.member.userId || this.member.id })
          .pipe(take(1))
          .subscribe(() => {
            return this.TopicMemberUserService.reset();
          });
      }
    });
  };

  doLeaveTopic() {
    const leaveDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_HEADING',
        description: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_TXT_ARE_YOU_SURE',
        points: ['MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_TXT_LEAVING_TOPIC_DESC'],
        confirmBtn: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_BTN_NO'
      }
    });
    leaveDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.TopicMemberUserService
          .delete({ id: this.AuthService.user.value.id, topicId: this.topic.id })
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate([this.Translate.currentLang, 'my', 'topics']);
          });
      }
    });
  };
}
