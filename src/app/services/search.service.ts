import { LocationService } from './location.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient, private Location: LocationService) { }

  /**
       * Search users
       *
       * NOTE: Each new requests cancels previous pending requests.
       *
       * @param {string} str Search string
       *
       * @returns {HttpPromise} Angular $http promise
       */
  searchUsers(str: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/search/users');

    return this.http.get(path, { withCredentials: true, observe: 'body', responseType: 'json', params: { str: str } }).pipe(switchMap((res: any) => {

      const results = res.data;
      return of(results)
    }))
  };

  /**
* Search
*
* NOTE: Each new requests cancels previous pending requests.
*
* @param {string} str Search string
* @param {object} params Request parameters {limit, page, include, "my.topic.level"}
*
* @returns {HttpPromise} Angular $http promise
*/
  search(str: string, params?: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/search');

    return this.http.get(path, { withCredentials: true, observe: 'body', responseType: 'json', params: { str } }).pipe(switchMap((res: any) => {
      const results = res.data;
      return of(results);
    }))
  };
}
