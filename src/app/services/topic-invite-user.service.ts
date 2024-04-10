import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { ItemsListService } from './items-list.service';
import { TopicService } from './topic.service';
import { Topic } from '../interfaces/topic';

@Injectable({
  providedIn: 'root'
})
export class TopicInviteUserService extends ItemsListService {
  params = Object.assign({ topicId: <string>'' }, this.defaultParams);
  params$ = new BehaviorSubject(this.params);
  constructor(private Location: LocationService, private http: HttpClient, private TopicService: TopicService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params: any) {
    return this.query(params);
  }

  query(params: { [key: string]: any }) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/invites/users', params);
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));
    return this.http.get<ApiResponse>(path, { params: queryParams, withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  }

  get(params?: any) {
    if (!params.inviteId) params.inviteId = params.id;
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/invites/users/:inviteId', params);

    return this.http.get<ApiResponse>(path, { params, withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        const data = res.data;
        console.log('DATA', data);
        data.user.isRegistered = res.status.code !== 20002;
        return data;
      })
    );
  }

  save(topicId: string, data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/invites/users', { topicId });

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  update(data: any) {
    if (!data.inviteId) data.inviteId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/invites/users/:inviteId', data);
    return this.http.put<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  }

  delete(data: any) {
    if (!data.inviteId) data.inviteId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/invites/users/:inviteId', data);

    return this.http.delete<ApiResponse>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  }

  accept(data: any) {
    if (!data.inviteId) data.inviteId = data.id;
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/invites/users/:inviteId/accept', data)

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  }

  canInvite (topic: Topic) {
    return this.TopicService.canDelete(topic);
  }
}
