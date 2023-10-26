import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, exhaustMap, catchError, shareReplay } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Group } from 'src/app/interfaces/group';
import { LocationService } from './location.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { UploadService } from './upload.service';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends ItemsListService {
  params = Object.assign(this.defaultParams, { visibility: <string | null>null,groupId: <string | null>null });
  params$ = new BehaviorSubject(this.params);

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

  constructor(private Location: LocationService, private http: HttpClient, private Notification: NotificationService, private Auth: AuthService, private Upload: UploadService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params: any) {
    return this.query(params);
  }

  private loadGroup$ = new BehaviorSubject<void>(undefined);

  loadGroup(id: string, params?: { [key: string]: string }) {
    return this.loadGroup$.pipe(
      exhaustMap(() => this.get(id, params)),
      shareReplay()
    );
  }

  reloadGroup(): void {
    this.loadGroup$.next();
  }

  get(id: string, params?: { [key: string]: string }): Observable<Group> {
    let url = '/api/groups/:groupId';
    if (this.Auth.loggedIn$.value) {
      url = '/api/users/self/groups/:groupId';
    }
    let path = this.Location.getAbsoluteUrlApi(url, { groupId: id });

    return this.http.get<ApiResponse>(path, { withCredentials: true, params, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    )
  }

  query(params: { [key: string]: any }) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/groups'), params);
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' })
    .pipe(
      map(res => res.data)
    )
  }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/groups');

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  }

  update(data: any) {
    const allowedFields = ['name', 'description', 'country', 'language', 'rules', 'contact', 'imageUrl'];
    const sendData: any = {};
    allowedFields.forEach((key) => {
      sendData[key] = data[key] || null;
    });
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId', { groupId: data.id || data.groupId });
    return this.http.put<ApiResponse>(path, sendData, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
    );
  }

  delete(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId', { groupId: data.id || data.groupId });

    return this.http.delete<ApiResponse>(path, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data)
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
      })
    );
  }

  uploadGroupImage(file: File, groupId: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/groups/:groupId/upload')
      .replace(':groupId', groupId);

    return this.Upload.upload(path, file);
  };

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
