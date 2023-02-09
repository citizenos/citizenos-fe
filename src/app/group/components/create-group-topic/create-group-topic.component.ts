import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { AppService } from 'src/app/services/app.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';

@Component({
  selector: 'app-create-group-topic',
  templateUrl: './create-group-topic.component.html',
  styleUrls: ['./create-group-topic.component.scss']
})
export class CreateGroupTopicComponent implements OnInit {
  group!: Group;
  newMemberTopicTitle?: string = '';
  VISIBILITY = this.GroupService.VISIBILITY;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private GroupService: GroupService, private app: AppService, private GroupMemberTopic: GroupMemberTopicService) {
    this.group = data.group;
  }

  ngOnInit(): void {
  }

  canUpdate() {
    return this.GroupService.canUpdate(this.group)
  }

  addNewGroupMemberTopic() {
    this.app.createNewTopic(this.newMemberTopicTitle, this.group.visibility, this.group.id, this.GroupMemberTopic.LEVELS.read)
  };
}
