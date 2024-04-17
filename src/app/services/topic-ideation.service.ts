import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { LocationService } from './location.service';
import { Observable, switchMap, map, of, tap, take, BehaviorSubject, exhaustMap, shareReplay } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic'; // Vote interface
import { Vote } from 'src/app/interfaces/vote'; // Vote interface
import { AuthService } from './auth.service';
import { TopicService } from './topic.service';

@Injectable({
  providedIn: 'root'
})
export class TopicIdeationService {
  STATUSES = this.TopicService.STATUSES;

  private loadIdeation$ = new BehaviorSubject<void>(undefined);

  constructor(private Location: LocationService, private http: HttpClient, private Auth: AuthService, private TopicService: TopicService) { }

  loadIdeation(params?: { [key: string]: string | boolean }) {
    return this.loadIdeation$.pipe(
      exhaustMap(() => this.get(params)),
      shareReplay()
    );
  }

  reloadVote(): void {
    this.loadIdeation$.next();
  }

  query(params: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('topics/:topicId/ideations'), params);

    return this.http.get<ApiResponse>(path, { withCredentials: true, params, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  get<Vote>(params?: any) {
    if (!params.voteId) params.voteId = params.id;
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId'), params);

    return this.http.get<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations'), data)

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  update(data: any) {
    if (!data.voteId) data.voteId = data.id;
    const path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId'), data);
    return this.http.put<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  delete(data: any) {
    if (!data.voteId) data.voteId = data.id;
    const path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/ideations/:ideationId'), data)

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }
}
