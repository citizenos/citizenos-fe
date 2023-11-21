import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { ItemsListService } from './items-list.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TopicMemberGroupService extends ItemsListService {
  params = Object.assign({ topicId: <string>'' }, this.defaultParams);
  params$ = new BehaviorSubject(this.params);

  public LEVELS = {
    read: 'read',
    edit: 'edit',
    admin: 'admin'
  };

  constructor(private Location: LocationService, private http: HttpClient, private Auth: AuthService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params: any) {
    return this.query(params);
  }

  query(params: { [key: string]: any }): Observable<ApiResponse> {
    //needs public topic API endpoint
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath(
        '/topics/:topicId/members/groups'
      ), params);
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  };

  save(data: any) {
    if (!data.groupId) {
      data.groupId = data.id;
    }
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/members/groups', data)

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  update(data: any) {
    if (!data.groupId) data.groupId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/members/groups/:groupId', data);
    return this.http.put<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  delete(data: any) {
    if (!data.groupId) data.groupId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/members/groups/:groupId', data);

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }
}
