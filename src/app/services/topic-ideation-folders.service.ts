import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { LocationService } from './location.service';
import { map, BehaviorSubject, exhaustMap, shareReplay } from 'rxjs';
import { AuthService } from './auth.service';
import { TopicService } from './topic.service';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class TopicIdeationFoldersService  extends ItemsListService {
  STATUSES = this.TopicService.STATUSES;

  params = {
    topicId: <string | null>null,
    ideationId: <string | null>null,
    types: <string | string[] | null>null,
    sortOrder: <string | null>null,
    offset: <number>0,
    authorId: <string | null>null,
    showModerated: <boolean | string | null>null,
    favourite: <boolean | string | null>null,
    limit: <number>8,
  };

  params$ = new BehaviorSubject(this.params);
  private loadFolders$ = new BehaviorSubject<void>(undefined);

  constructor(private Location: LocationService, private http: HttpClient, private Auth: AuthService, private TopicService: TopicService) {
    super();
    this.items$ = this.loadItems();
  }

  loadIdeation(params?: { [key: string]: string | boolean }) {
    return this.loadFolders$.pipe(
      exhaustMap(() => this.get(params)),
      shareReplay()
    );
  }

  reloadFolders(): void {
    this.loadFolders$.next();
  }

  get(params?: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId/folders/:folderId'), params);

    return this.http.get<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  query(params?: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId/folders'), params);

    return this.http.get<ApiResponse>(path, { withCredentials: true, observe: 'body', params, responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  save(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId/folders'), params);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  update(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId/folders/:folderId'), params);

    return this.http.put<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  delete(params: any) {
    const path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId/folders/:folderId'), params);

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  addIdea(params: any, data: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId/folders/:folderId/ideas'), params);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  removeIdea(params: any) {
    const path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId/folders/:folderId/ideas/:ideaId'), params);

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  getItems(params: any) {
    return this.query(params);
  }
}
