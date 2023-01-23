import { Topic } from 'src/app/interfaces/topic';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocationService } from './location.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/apiResponse';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class TopicNotificationService extends ItemsListService {
  params = Object.assign({}, this.defaultParams);
  params$ = new BehaviorSubject(Object.assign({}, this.params));

  constructor(private http: HttpClient, private Location: LocationService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params: any) {
    return this.query(params);
  }

  query(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/notificationsettings/topics');
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  };

  get(params?: any) {
    if (!params.topicId) params.topicId = params.id;
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/notificationsettings', params);

    return this.http.get<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  delete(data: any) {
    if (!data.topicId) data.topicId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/notificationsettings', data);

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
        return res.data;
      }));
  }

  save(data: any) {
    if (!data.topicId) data.topicId = data.id;
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/notificationsettings', data);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
      return res.data
    }));
  }

  update(data: any) {
    if (!data.topicId) data.topicId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/notificationsettings', data);
    return this.http.put<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
      return res.data
    }));
  }
}
