import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Topic } from 'src/app/interfaces/topic';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class PublicTopicService extends ItemsListService {
  params = Object.assign(this.defaultParams, {
    showModerated: <boolean>false,
    statuses: <Array<string> | string | null>null,
    include: <Array<string> | string | null>null,
    categories: <Array<string> | string | null>null,
    title: <string | null>null,
    visibility: <string | null>null,
    hasVoted: <boolean | string | null>null,
    creatorId: <string | null>null,
    favourite: <boolean | string | null>null,
  });
  params$ = new BehaviorSubject(this.params);
  STATUSES = <string[]>['inProgress', // Being worked on
    'voting', // Is being voted which means the Topic is locked and cannot be edited.
    'followUp', // Done editing Topic and executing on the follow up plan.
    'closed' // Final status - Topic is completed and no editing/reopening/voting can occur.
  ];

  VISIBILITY = [
    'public', // Everyone has read-only on the Topic.  Pops up in the searches..
    'private' // No-one can see except collaborators
  ];

  constructor(private Location: LocationService, private http: HttpClient) {
    super();
    this.items$ = this.loadItems();
  }

  getItems (params:any) {
    return this.queryPublic(params);
  }

  queryPublic(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/topics');
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  };
}
