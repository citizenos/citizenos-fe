import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, switchMap, of, catchError, share } from 'rxjs';

import { LocationService } from './location.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberUserService {
  public LEVELS = ['read', 'admin'];
  constructor(private Location: LocationService, private http: HttpClient, private Notification: NotificationService) { }

  delete(params: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/members/users/:userId', params)

    return this.http.delete(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      }),
      share()
    )
  }

}
