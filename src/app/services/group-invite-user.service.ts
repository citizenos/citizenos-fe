import { LocationService } from 'src/app/services/location.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, share } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupInviteUserService {
  constructor(private http: HttpClient, private Location: LocationService) { }

  get(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users/:inviteId', params);

    return this.http.get<any>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        const data = res.data;
        data.user.isRegistered = res.status.code !== 20002;
        return data;
      }),
      share()
    );
  }

  save(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users', params);

    return this.http.post<any>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      }),
      share()
    );
  }

  query(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users', params);

    return this.http.get<any>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        return res.data;
      }),
      share()
    );
  }

  accept(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users/:inviteId/accept', params);

    return this.http.post<any>(path, {}, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      }),
      share()
    );
  }

  delete(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/invites/users/:inviteId', params);

    return this.http.delete<any>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      }),
      share()
    );
  }
}
