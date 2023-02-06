import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocationService } from './location.service';
import { AuthService } from './auth.service';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { map, BehaviorSubject } from 'rxjs';
import { ItemsListService } from './items-list.service';
@Injectable({
  providedIn: 'root'
})
export class SocialMentionsService extends ItemsListService {
  params = {
    topicId: <string>''
  };
  params$ = new BehaviorSubject(this.params);
  constructor(private http: HttpClient, private Auth: AuthService, private Location: LocationService) {
    super();
  }

  getItems (params:any) {
    return this.query(params);
  }

  query(params: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/mentions'), params)

    return this.http.get<ApiResponse>(path, { withCredentials: true, params, responseType: 'json', observe: 'body' }).pipe(
      map(res=>res.data)
    )
}
}
