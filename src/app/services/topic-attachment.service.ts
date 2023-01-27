import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/apiResponse';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})

export class TopicAttachmentService  extends ItemsListService {
  params = Object.assign({}, this.defaultParams);
  params$ = new BehaviorSubject(this.params);
  constructor(private Auth: AuthService, private Location:LocationService, private http: HttpClient) {
    super();
    this.items$ = this.loadItems();
  }

  getItems (params:any) {
    return this.query(params);
  }


  query(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/attachments'), params);
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  };
}
