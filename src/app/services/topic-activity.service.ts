import { ActivityService } from 'src/app/services/activity.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class TopicActivityService extends ItemsListService {
  override params = {
    offset: <number>0,
    limit: <number>10,
    include: <string | null>null,
    filter: <string | null>null,
    topicId: <string | null>'',
  };
  params$ = new BehaviorSubject(Object.assign({}, this.params));

  constructor (public Location: LocationService, public Auth: AuthService, public http: HttpClient, private ActivityService: ActivityService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params: any) {
    return this.query(params);
  }

  query(params: { [key: string]: any }) {
    let path = this.Location.getAbsoluteUrlApi(
      this.Auth.resolveAuthorizedPath(
        '/topics/:topicId/activities'
      ), params);
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));
    return this.http.get(path, { params: queryParams, withCredentials: true, responseType: 'json', observe: 'body' })
      .pipe(
        map(this.ActivityService.success)
      );
  };
}
