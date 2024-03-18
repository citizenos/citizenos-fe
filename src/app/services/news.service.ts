import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor( private http: HttpClient, private Location: LocationService) { }

  get(){
    let path = this.Location.getAbsoluteUrlApi('/api/news');

    return this.http.get<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data.items)
    )
  }
}
