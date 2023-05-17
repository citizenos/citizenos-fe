import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { LocationService } from './location.service';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VoteDelegationService {

  constructor(private Location: LocationService, private http: HttpClient, private Auth: AuthService) { }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/votes/:voteId/delegations', data)

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  delete(data: any) {
    if (!data.voteId) data.voteId = data.id;
    const path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/votes/:voteId/delegations'), data)

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }
}
