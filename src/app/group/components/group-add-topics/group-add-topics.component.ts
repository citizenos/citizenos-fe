import { Topic } from 'src/app/interfaces/topic';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { AppService } from 'src/app/services/app.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { of } from 'rxjs';
@Component({
  selector: 'app-group-add-topics',
  templateUrl: './group-add-topics.component.html',
  styleUrls: ['./group-add-topics.component.scss']
})
export class GroupAddTopicsComponent implements OnInit {
  group!: Group;
  VISIBILITY = this.GroupService.VISIBILITY;
  searchResults$ = of(<Topic[] | any[]>[]);
  memberTopics$ = of(<Topic[] | any[]>[]);
  constructor(@Inject(MAT_DIALOG_DATA) data: any,
  private GroupService: GroupService,
  private app: AppService,
  private GroupMemberTopicService: GroupMemberTopicService) {
    this.group = data.group;
    GroupMemberTopicService.setParam('groupId', this.group.id);
    this.memberTopics$ = GroupMemberTopicService.items$;
  }

  ngOnInit(): void {
  }

  canUpdate() {
    return this.GroupService.canUpdate(this.group)
  }

  doSaveGroup() {
   /* this.errors = null;

    const savePromises = [];
    // TODO: Once there is POST /groups/:groupId/members/topics use that
    this.memberTopics.forEach((topic) => {
        const member = {
            groupId: this.group.id,
            topicId: topic.id,
            level: topic.permission.level
        };
        savePromises.push(
            this.GroupMemberTopicService.save({ groupId: this.group.id, topicId: topic.id }, member)
        )
    });

    return Promise.all(savePromises)
        .then(() => {
            const dialogs = this.ngDialog.getOpenDialogs();
            this.$timeout(() => {
                this.GroupMemberTopicService.reload();
                this.ngDialog.close(dialogs[0], '$closeButton');
                location.reload();
            })
        }), ((errorResponse) => {
            if (errorResponse.data && errorResponse.data.errors) {
                this.errors = errorResponse.data.errors;
                console.log(errorResponse.data.errors);
            }
        });*/
};
}
