import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { LocationService } from './location.service';
import { map, BehaviorSubject, exhaustMap, shareReplay } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { Discussion } from 'src/app/interfaces/discussion'; // Discussion interface
import { AuthService } from './auth.service';
import { TopicService } from './topic.service';
import { ItemsListService } from './items-list.service';

@Injectable({
  providedIn: 'root'
})
export class TopicDiscussionService extends ItemsListService {
  STATUSES = this.TopicService.STATUSES;

  params = {
    topicId: <string | null>null,
    discussionId: <string | null>null,
    types: <string | string[] | null>null,
    sortOrder: <string | null>null,
    offset: <number>0,
    authorId: <string | null>null,
    showModerated: <boolean | string | null>null,
    favourite: <boolean | string | null>null,
    limit: <number>8,
  };

  params$ = new BehaviorSubject(this.params);
  private loadDiscussion$ = new BehaviorSubject<void>(undefined);

  constructor(private Location: LocationService, private http: HttpClient, private Auth: AuthService, private TopicService: TopicService) {
    super();
    this.items$ = this.loadItems();
  }

  loadDiscussion(params?: { [key: string]: string | null }) {
    return this.loadDiscussion$.pipe(
      exhaustMap(() => this.get(params)),
      shareReplay()
    );
  }

  reloadDiscussion(): void {
    this.loadDiscussion$.next();
  }

  query(params: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions'), params);

    return this.http.get<ApiResponse>(path, { withCredentials: true, params, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  get<Discussion>(params?: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId'), params);

    return this.http.get<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions'), data)

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  participants(data: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId/participants'), data);

    return this.http.get<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  update(data: any) {
    const path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId'), {topicId: data.topicId, discussionId: data.discussionId || data.id});
    return this.http.put<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  delete(data: any) {
    if (!data.discussionId) data.discussionId = data.id;
    const path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId'), data)

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  hasDiscussionEnded(topic: Topic, discussion: Discussion) {
    if ([this.STATUSES.draft, this.STATUSES.inProgress].indexOf(topic.status) === -1) {
      return true;
    }
    return discussion && discussion.deadline && new Date() > new Date(discussion.deadline);
  };

  hasDiscussionEndedExpired(topic: Topic, discussion: Discussion) {
    return ([this.STATUSES.draft, this.STATUSES.followUp, this.STATUSES.closed].indexOf(topic.status) > -1) || discussion.deadline && (new Date() > new Date(discussion.deadline));
  };

  getItems(params: any) {
    return this.get(params);
  }
}
