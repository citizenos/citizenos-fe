
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LocationService } from 'src/app/services/location.service';
import { map, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TopicJoinService {

  constructor(private Location: LocationService, private http: HttpClient) { }

  join(token: string) {
    console.log('join', token)
    const path = this.Location.getAbsoluteUrlApi('/api/topics/join/:token', { token });
    console.log('path', path)
    return this.http.post<any>(path, {}, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((data) => {
        console.log('data', data);
        return data;
      }),
      share()
    );
  }

  save(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/join', { topicId: data.topicId });
    return this.http.put<any>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        return res.data;
      }),
      share()
    );
  }

  update(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/join/:token', { topicId: data.topicId || data.id, token: data.token });

    return this.http.put<any>(path, data, { withCredentials: true, responseType: 'json', observe: 'body' }).pipe(
      map((res) => {
        return res.data;
      }),
      share()
    );
  }
}

