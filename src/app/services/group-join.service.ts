
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NotificationService } from 'src/app/services/notification.service';
import { LocationService } from 'src/app/services/location.service';
import { map, catchError, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupJoinService {

  constructor(private Location: LocationService, private http: HttpClient, private Notification: NotificationService) { }

  join(token: string) {
    console.log('join', token)
    const path = this.Location.getAbsoluteUrlApi('/api/groups/join/:token', { token });
    console.log('path', path)
    return this.http.post<any>(path, {}, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        console.log('data', data);
        return data;
      }),
      share()
    );
  }

  save(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/join', { groupId: data.groupId });
    return this.http.put<any>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        return res.data;
      }),
      share()
    );
  }

  update(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/join/:token', { groupId: data.groupId || data.id, token: data.token });

    return this.http.put<any>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        return res.data;
      }),
      share()
    );
  }
}
