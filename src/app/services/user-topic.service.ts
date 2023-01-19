import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { TopicService } from './topic.service';
import { BehaviorSubject } from 'rxjs';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class UserTopicService extends ItemsListService {
  params = Object.assign(this.defaultParams, {
    showModerated: <boolean>false,
    limit: <number>26,
    statuses: <Array<string> | null | string>null,
    include: <Array<string> | null | string>null,
    categories: <Array<string> | null | string>null,
    title: <string | null>null,
    prefix: <string | null>null,
    userId: <string | null>null,
    visibility: <string | null>null,
    hasVoted: <boolean | null | string>null,
    creatorId: <string | null>null,
    pinned: <boolean | null | string> null,
  });

  params$ = new BehaviorSubject(Object.assign({}, this.params));

  STATUSES = <string[]>['inProgress', // Being worked on
    'voting', // Is being voted which means the Topic is locked and cannot be edited.
    'followUp', // Done editing Topic and executing on the follow up plan.
    'closed' // Final status - Topic is completed and no editing/reopening/voting can occur.
  ];

  VISIBILITY = [
    'public', // Everyone has read-only on the Topic.  Pops up in the searches..
    'private' // No-one can see except collaborators
  ];

  constructor(private TopicService: TopicService, private Auth: AuthService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems (params:any) {
    return this.TopicService.query(params)
  }
}
