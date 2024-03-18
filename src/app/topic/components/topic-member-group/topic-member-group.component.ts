import { Component, OnInit, Input } from '@angular/core';
import { take } from 'rxjs';
import { DialogService } from 'src/app/shared/dialog';

import { Topic } from 'src/app/interfaces/topic';
import { TopicMemberGroup } from 'src/app/interfaces/group';

import { TopicService } from 'src/app/services/topic.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'topic-member-group',
  templateUrl: './topic-member-group.component.html',
  styleUrls: ['./topic-member-group.component.scss']
})
export class TopicMemberGroupComponent implements OnInit {
  @Input() group: TopicMemberGroup | any;
  @Input() canUpdate?: any;
  @Input() topic: Topic | any;
  @Input() fields?: any;

  groupLevels = Object.keys(this.TopicService.LEVELS);
  wWidth = window.innerWidth
  constructor(
    private dialog: DialogService,
    public TopicService: TopicService,
    private TopicMemberGroupService: TopicMemberGroupService
  ) { }

  ngOnInit(): void {
  }

  doUpdateMemberGroup(level: any) {
    if (this.group.level !== level) {
      const oldLevel = this.group.level;
      this.group.level = level;
      this.group.topicId = this.topic?.id;

      this.TopicMemberGroupService.update(this.group)
      .pipe(take(1))
      .subscribe(() => {
        this.TopicMemberGroupService.reset();
      })
    }
  };
  doDeleteMemberGroup() {
    const deleteUserDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_MEMBER_GROUP_DELETE_CONFIRM_HEADING',
        description: 'MODALS.TOPIC_MEMBER_GROUP_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        confirmBtn: 'MODALS.TOPIC_MEMBER_GROUP_DELETE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.TOPIC_MEMBER_GROUP_DELETE_CONFIRM_BTN_NO'
      }
    });
    deleteUserDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.group.topicId = this.topic.id;
        this.TopicMemberGroupService.delete({ topicId: this.topic.id, groupId: this.group.userId || this.group.id })
          .pipe(take(1))
          .subscribe(() => {
            this.TopicService.reloadTopic();
            return this.TopicMemberGroupService.reset();
          });
      }
    });
    /* this.ngDialog
       .openConfirm({
         template: '/views/modals/topic_member_group_delete_confirm.html',
         data: {
           group: topicMemberGroup
         }
       })
       .then(() => {
         topicMemberGroup.topicId = this.topic.id;
         this.TopicMemberGroup
           .delete(topicMemberGroup)
           .then(() => {
             this.TopicMemberGroupService.reload();
             this.TopicMemberUserService.reload();
             this.topic.members.groups.count = this.topic.members.groups.count - 1;
           });
       }, angular.noop);*/
  };
}
