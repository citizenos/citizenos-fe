import { ApiResponse } from './../interfaces/apiResponse';
import { TopicService } from 'src/app/services/topic.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberTopicService {

  constructor(private http: HttpClient, private Location: LocationService, private Auth: AuthService, private Topic: TopicService) { }
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

  save(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath(
        '/topics/:topicId/members/groups')
      , params)

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

  query(params: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/groups/:groupId/members/topics')
      , params);

    return this.http.get<ApiResponse>(path, { params, withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        map(res => res.data)
      );
  }

  queryPublic(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/groups/:groupId/members/topics', params);

    return this.http.get<ApiResponse>(path, { params, withCredentials: true, responseType: 'json', observe: 'body' })
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
