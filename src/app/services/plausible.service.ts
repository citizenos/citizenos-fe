import { LocationService } from 'src/app/services/location.service';
import { Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PlausibleService {

  constructor( private http: HttpClient, private config: ConfigService, private LocationService: LocationService) { }

  post(data: any){
    const plausibleConfig = this.config.get('plausible');
    if (!plausibleConfig['api']) return;
    let path = plausibleConfig['api'] + '/api/event';
    const domain = this.config.get('plausible')['domain'] || new URL(window.location.href).hostname;

    const postData = Object.assign({
      domain: domain,
      url: window.location.href,
    }, data)
    return this.http.post<ApiResponse>(path, postData, { responseType: 'json', observe: 'body' }).pipe(
      map(res => res.data),
      take(1)
    ).subscribe();
  }
}
