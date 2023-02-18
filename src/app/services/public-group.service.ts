import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { Observable, BehaviorSubject, map, switchMap, tap, of, catchError, distinct, EMPTY } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Group } from 'src/app/interfaces/group';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGroupService extends ItemsListService {
  params = Object.assign(this.defaultParams, {
    groupId: <string | null>null,
    showModerated: <boolean>false,
    limit: 8
  });
  params$ = new BehaviorSubject(Object.assign({},this.params));

  constructor(private Location: LocationService, private http: HttpClient) {
    super();
    this.items$ = this.loadItems();
  }

  getItems (params:any) {
    return this.queryPublic(params);
  }

  queryPublic(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/groups');
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  };
}
