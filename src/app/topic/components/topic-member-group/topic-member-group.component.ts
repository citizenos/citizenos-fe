import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { TopicMemberGroup } from 'src/app/interfaces/group';

import { TopicService } from 'src/app/services/topic.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
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
    public TopicService: TopicService,
    private TopicMemberGroupService: TopicMemberGroupService
  ) { }

  ngOnInit(): void {
  }

  doUpdateMemberGroup(level: string) {
    if (this.group.level !== level) {
      const oldLevel = this.group.level;
      this.group.level = level;
      this.group.topicId = this.topic?.id;

      //this.TopicMemberGroupService.update()
    }
  };
  doDeleteMemberGroup() {
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
