import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class TopicEventService extends ItemsListService {
  params = Object.assign({
    topicId: <string | null>null
  }, this.defaultParams);

  params$ = new BehaviorSubject(this.params);

  constructor(private Location: LocationService, private http: HttpClient,  private Auth: AuthService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params: any) {
    return this.query(params);
  }

  queryPublic(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/topics');
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  };

  query(params: { [key: string]: any }) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/events'), params)
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));
    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/events', data);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  update(data: any) {
    if (!data.eventId) data.eventId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/events/:eventId', data);
    return this.http.put<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  delete(data: any) {
    if (!data.eventId) data.eventId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/events/:eventId', data);

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }
}
