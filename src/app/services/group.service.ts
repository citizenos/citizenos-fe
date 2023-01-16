import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, switchMap, of, catchError, share } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Group } from 'src/app/interfaces/group';
import { LocationService } from './location.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  params$ = new BehaviorSubject({
    showModerated: <boolean>false,
    offset: <number>0,
    limit: <number>8,
    orderBy: <string | null>'name',
    order: <string | null>'ASC',
    sourcePartnerId: <string | null>null,
    search: <string | null>null
  });

  public VISIBILITY = {
    public: 'public',
    private: 'private'
  };

  public members = {
    topics: {
      rows: [],
      latest: null,
      order: null,
      count: 0
    },
    users: {
      rows: [],
      count: 0
    }
  };

  public permission = {
    level: 'none'
  };

  constructor(private Location: LocationService, private http: HttpClient, private Notification: NotificationService, private Auth: AuthService) {
  }

  get(id: string, params?: { [key: string]: string }): Observable<Group> {
    let url = '/api/groups/:groupId';
    if (this.Auth.loggedIn$.value) {
      url = '/api/users/self/groups/:groupId';
    }
    let path = this.Location.getAbsoluteUrlApi(url, { groupId: id });

    return this.http.get<Group>(path, { withCredentials: true, params, observe: 'body', responseType: 'json' })
      .pipe(switchMap((res: any) => {
        const topic = res.data;
        return of(topic);
      }))
  }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups');

    return this.http.post(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      }),
      catchError(res => {
        if (res.error) {
          if (res.error.status !== 401) {
            this.Notification.addError(res.error.status.message);
          }
        }
        return res;
      }),
      share()
    );
  }

  update(data: any) {
    const allowedFields = ['name', 'description', 'imageUrl'];
    const sendData: any = {};
    allowedFields.forEach((key) => {
      sendData[key] = data[key] || null;
    });
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId', { groupId: data.id || data.groupId });
    return this.http.put(path, sendData, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        return data;
      }),
      catchError(res => {
        if (res.error) {
          if (res.error.status !== 401) {
            this.Notification.addError(res.error.status.message);
          }
        }
        return res;
      }),
      share()
    );
  }

  delete(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId', { groupId: data.id || data.groupId });

    return this.http.delete(path).pipe(
      map((data) => {
        return data;
      }),
      catchError(res => {
        if (res.error) {
          if (res.error.status !== 401) {
            this.Notification.addError(res.error.status.message);
          }
        }
        return res;
      }),
      share()
    );
  }

  join(token: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/groups/join/:token', { token });

    return this.http.post<ApiResponse>(path, {}).pipe(
      map((res) => {
        return res.data;
      }),
      catchError(res => {
        if (res.error) {
          if (res.error.status !== 401) {
            this.Notification.addError(res.error.status.message);
          }
        }
        return res;
      }),
      share()
    );
  }

  canUpdate(group: Group) {
    //this.GroupMemberUser.LEVELS.admin replace with 'admin'
    return group && ((group.permission && group.permission.level === 'admin') || (group.userLevel && group.userLevel === 'admin'));
  };

  canShare(group: Group) {
    return group && (!this.isPrivate(group) || this.canUpdate(group));
  }
  canDelete(group: Group) {
    return this.canUpdate(group);
  };

  isPrivate(group: Group) {
    return group && group.visibility === this.VISIBILITY.private;
  };
}
