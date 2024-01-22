import { ApiResponse } from './../interfaces/apiResponse';
import { TopicService } from 'src/app/services/topic.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberTopicService extends ItemsListService {
  params = Object.assign(this.defaultParams, {
    groupId: <string | null>null,
    showModerated: <boolean>false,
    visibility: <string | null| undefined>null,
    country: <Array<string> | string | null>null,
    language: <Array<string> | string | null>null,
    statuses: <Array<string> | string | null>null,
    title: <string | null>null
  });
  params$ = new BehaviorSubject(this.params);
  constructor(private http: HttpClient, private Location: LocationService, private Auth: AuthService, private Topic: TopicService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params: any) {
    return this.query(params)
  }

  public LEVELS = {
    read: 'read',
    edit: 'edit',
    admin: 'admin'
  };

  get(params: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath(
        '/topics/:topicId/members/groups/:groupId'
      ), params);

    return this.http.get(path, { withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        map((res: any) => {
          const data = res.data;
          data.user.isRegistered = res.status.code !== 20002;
          return data;
        }));
  }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath(
        '/topics/:topicId/members/groups')
      , data)

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        map(res => res.data)
      );
  }

  update(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/topics/:topicId/members/groups/:groupId')
      , params);

    return this.http.put<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        map(res => res.data)
      );
  }

  query(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/groups/:groupId/members/topics')
      , params);
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));
    return this.http.get<ApiResponse>(path, { params: queryParams, withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        switchMap(res => of(res.data))
      );
  }

  queryPublic(params: { [key: string]: any }) {
    let path = this.Location.getAbsoluteUrlApi('/api/groups/:groupId/members/topics', params);

    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { params: queryParams, withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        map(res => res.data)
      );
  }

  delete(params: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/topics/:topicId/members/groups/:groupId')
      , params);

    return this.http.delete<ApiResponse>(path, { withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        map(res => res.data)
      );
  }
}
