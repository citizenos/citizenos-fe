import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class TopicMemberGroupService extends ItemsListService {
  params = Object.assign({ topicId: <string>'' }, this.defaultParams);
  params$ = new BehaviorSubject(this.params);
  constructor(private Location: LocationService, private http: HttpClient) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params: any) {
    return this.query(params);
  }

  query(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/members/groups', params);
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  };
}
