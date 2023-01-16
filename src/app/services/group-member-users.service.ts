import { Injectable } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { ItemsListService } from './items-list.service';
import { GroupMemberUserService } from './group-member-user.service';
@Injectable({
  providedIn: 'root'
})
export class GroupMemberUsersService extends ItemsListService {
  params = Object.assign(this.defaultParams, {groupId: <string | null>null});
  params$ = new BehaviorSubject(this.params);
  constructor(private GroupMemberUserService: GroupMemberUserService) {
    super ();
    console.log(this);
    this.items$ = this.loadItems();
  }

  reload() {
    this.params$.value.offset = 0;
    this.params$.value.page = 1;
    this.items$ = of([]);
  }

  getItems (params:any) {
    return this.GroupMemberUserService.query(params)
  }
}
