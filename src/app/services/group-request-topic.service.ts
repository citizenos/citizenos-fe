import { LocationService } from 'src/app/services/location.service';
import { ItemsListService } from 'src/app/services/items-list.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, BehaviorSubject, shareReplay, exhaustMap } from 'rxjs';
import { ApiResponse } from '../interfaces/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class GroupRequestTopicService extends ItemsListService {
  params = Object.assign(this.defaultParams, {groupId: <string | null>null});
  params$ = new BehaviorSubject(this.params);

  public LEVELS = ['read','admin'];
  public loadMembers$ = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient, private Location: LocationService) {
    super();
    this.items$ = this.loadMembers$.pipe(
      exhaustMap(() => this.loadItems()),
      shareReplay()
    );
  }

  reloadItems(): void {
    this.loadMembers$.next();
  }

  getItems(params:any) {
    return this.query(params);
  }

  get(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/requests/topics/:requestId', params);

    return this.http.get<any>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  save(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/requests/topics', params);

    return this.http.post<any>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  query(params: { [key: string]: any }) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/requests/topics', params);
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<any>(path, { withCredentials: true, params: queryParams, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  accept(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/requests/topics/:requestId/accept', params);

    return this.http.post<any>(path, {}, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  reject(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/requests/topics/:requestId/reject', params);

    return this.http.post<any>(path, {}, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  delete(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/requests/topics/:requestId', params);

    return this.http.delete<any>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  update(data: any) {
    if (!data.inviteId) data.inviteId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/requests/topics/:requestId', data);
    return this.http.put<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  }
}
