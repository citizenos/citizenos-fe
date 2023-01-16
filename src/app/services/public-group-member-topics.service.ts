import { ItemsListService } from './items-list.service';
import { Injectable } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { GroupMemberTopicService } from './group-member-topic.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGroupMemberTopicsService extends ItemsListService {
  params = Object.assign(this.defaultParams, {groupId: <string | null>null});
  params$ = new BehaviorSubject(this.params);
  constructor(private GroupMemberTopicService: GroupMemberTopicService) {
    super();
    console.log(this);
    this.items$ = this.loadItems();
  }

  reload() {
    this.params$.value.offset = 0;
    this.params$.value.page = 1;
    this.items$ = of([]);
  }

  getItems (params:any) {
    return this.GroupMemberTopicService.queryPublic(params)
  }
}
