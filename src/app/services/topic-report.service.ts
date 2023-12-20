import { Injectable } from '@angular/core';
import { ItemsListService } from './items-list.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';

import { LocationService } from './location.service';
import { AuthService } from './auth.service';
import { ApiResponse } from 'src/app/interfaces/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class TopicReportService extends ItemsListService{
  params = Object.assign({topicId:  <string | null>null}, this.defaultParams);
  params$ = new BehaviorSubject(Object.assign({}, this.params));
  public TYPES = {
    abuse: 'abuse', // is abusive or insulting
    obscene: 'obscene', // contains obscene language
    spam: 'spam', // contains spam or is unrelated to topic
    hate: 'hate', // contains hate speech
    duplicate: 'duplicate', // duplicate,
    other: 'other'
  };

  constructor(private Location: LocationService, private http: HttpClient, private Auth: AuthService) {
    super ();
    this.items$ = this.loadItems();
  }

  getItems (params:any) {
    return this.query(params)
  }

  query(params: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/topics/:topicId/reports'),
      params);

    return this.http.get<ApiResponse>(path, { withCredentials: true, params, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    )
  }

  get(params?: any) {
    if (!params.reportId) params.reportId = params.id;
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/topics/:topicId/reports/:reportId'),
      params);

    return this.http.get<ApiResponse>(path, { withCredentials: true, params, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    )
  }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/topics/:topicId/reports'),
      data);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    )
  }

  moderate(data: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/topics/:topicId/reports/:id/moderate'),
      data);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    )
  }

  review(data: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/topics/:topicId/reports/:id/review'),
      data);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    )
  }

  resolve(data: any) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath('/topics/:topicId/reports/:id/resolve'),
      data);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    )
  }
}
