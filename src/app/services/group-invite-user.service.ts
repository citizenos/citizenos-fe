import { LocationService } from 'src/app/services/location.service';
import { ItemsListService } from 'src/app/services/items-list.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupInviteUserService extends ItemsListService {
  params = Object.assign(this.defaultParams, {groupId: <string | null>null});
  params$ = new BehaviorSubject(this.params);

  constructor(private http: HttpClient, private Location: LocationService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params:any) {
    return this.query(params);
  }

  get(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users/:inviteId', params);

    return this.http.get<any>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        const data = res.data;
        data.user.isRegistered = res.status.code !== 20002;
        return data;
      })
    );
  }

  save(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users', params);

    return this.http.post<any>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  query(params: { [key: string]: any }) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users', params);

    return this.http.get<any>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  accept(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users/:inviteId/accept', params);

    return this.http.post<any>(path, {}, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  delete(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users/:id', params);

    return this.http.delete<any>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
