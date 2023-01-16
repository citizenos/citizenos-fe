import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, switchMap, of, catchError, share } from 'rxjs';

import { LocationService } from './location.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberUserService {
  public LEVELS = ['read', 'admin'];
  constructor(private Location: LocationService, private http: HttpClient, private Auth: AuthService) { }

  get(params: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/groups/:groupId/members/users/:userId'),
      { 'userId:': params.userId, 'groupId:': params.groupId })

    return this.http.get<ApiResponse>(path, { withCredentials: true }).pipe(
      map((res) => {
        return res.data;
      }),
      share()
    )
  }

  save(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/members/users', params);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true }).pipe(
      map((res) => {
        return res.data;
      }),
      share()
    )
  }

  update(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/members/users/:userId', params);

    return this.http.put<ApiResponse>(path, data, { withCredentials: true }).pipe(
      map((res) => {
        return res.data;
      }),
      share()
    )
  }

  query(params: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/groups/:groupId/members/users'),
      { groupId: params.groupId });

    return this.http.get<ApiResponse>(path, { withCredentials: true, params }).pipe(
      map((res:any) => {
        return res.data;
      }),
      share()
    )
  }

  delete(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/members/users/:userId', params)

    return this.http.delete<ApiResponse>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      }),
      share()
    )
  }

}
