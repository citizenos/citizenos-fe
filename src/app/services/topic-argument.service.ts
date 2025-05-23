import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Argument } from 'src/app/interfaces/argument';
import { Observable, BehaviorSubject, map, distinct, catchError, EMPTY, combineLatest, switchMap, exhaustMap, shareReplay } from 'rxjs';
import { ItemsListService } from './items-list.service';
@Injectable({
  providedIn: 'root'
})

export class TopicArgumentService extends ItemsListService {

  public ARGUMENT_TYPES = {
    pro: 'pro',
    con: 'con',
    poi: 'poi',
    reply: 'reply'
  };

  public ARGUMENT_SUBJECT_MAXLENGTH = 128;

  public ARGUMENT_TYPES_MAXLENGTH = <any>{
    'pro': 2048,
    'con': 2048,
    'poi': 2048,
    'reply': 2048
  };

  public ARGUMENT_REPORT_TYPES = {
    abuse: 'abuse', // is abusive or insulting
    obscene: 'obscene', // contains obscene language
    spam: 'spam', // contains spam or is unrelated to topic
    hate: 'hate', // contains hate speech
    duplicate: 'duplicate', // duplicate
    other: 'other'
  };

  public ARGUMENT_ORDER_BY = {
    //    rating: 'rating', removed 23.12.2022
    popularity: 'popularity',
    date: 'date'
  };
  ARGUMENT_VERSION_SEPARATOR = '_v';
  ArgumentIds = <string[]>[];
  params = {
    topicId: <string | null> null,
    discussionId: <string | null> null,
    orderBy: this.ARGUMENT_ORDER_BY.date,
    types: <string | string[] | null>null,
    sortOrder: <string | null>null,
    offset: <number>0,
    limit: <number>8,
  };

  params$ = new BehaviorSubject(this.params);

  count = new BehaviorSubject({
    total: 0,
    con: 0,
    pro: 0,
    poi: 0,
    reply: 0
  });

  constructor(private readonly http: HttpClient, private readonly Location: LocationService, private readonly Auth: AuthService) {
    super();
    this.items$ = this.loadItems();

  }

  loadArguments() {
    return this.reload$.pipe(
      exhaustMap(() => this.loadItems()),
      shareReplay()
    );
  }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId/comments'), data);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  update(data: any) {
    if (!data.commentId) data.commentId = data.id;
    const path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId/comments/:commentId'), data);

    return this.http.put<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  delete(data: any) {
    if (!data.commentId) data.commentId = data.id;
    const path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId/comments/:commentId'), data)

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  query(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId/comments'), params);

    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' });
  }

  vote(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/topics/:topicId/discussions/:discussionId/comments/:commentId/votes', data);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  votes(data: { [key: string]: any }) {
    if (!data['commentId']) data['commentId'] = data['id'];
    const queryParams = Object.fromEntries(Object.entries(data).filter((i) => i[1] !== null));

    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId/comments/:commentId/votes'), data);
    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  };

  report(data: any) {
    if (!data.commentId) data.commentId = data.id;
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/discussions/:discussionId/comments/:commentId/reports'), data);

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  };

  getReport(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/topics/:topicId/discussions/:discussionId/comments/:commentId/reports/:reportId', data);
    if (path.indexOf('/discussions/:discussionId')) {
      path = path.replace('/discussions/:discussionId', '');
    }

    const headers = {
      'Authorization': 'Bearer ' + data.token
    };
    return this.http.get<ApiResponse>(path, { headers, withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  };

  moderate(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/topics/:topicId/comments/:commentId/reports/:reportId/moderate', data)
    const headers = {
      'Authorization': 'Bearer ' + data.token
    };

    return this.http.post<ApiResponse>(path, data.report, { headers, withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  getItems(params: any) {
    return this.getArguments(params);
  }

  getArguments(params?: any) {
    return this.query(params).pipe(
      map((res) => {
        this.count.next(res.data.count);
        this.ArgumentIds = [];
        res.data.rows.forEach((argument: Argument) => {
          this.ArgumentIds.push(argument.id)
          if (argument.replies.count) {
            argument.replies.rows.forEach((reply: Argument) => this.ArgumentIds.push(reply.id))
          }
        })
        return { rows: res.data.rows, count: res.data.count, countTotal: (res.data.count.total - res.data.count.reply) || 0 }
      }),
      distinct(),
      catchError(() => EMPTY)
    );
  }

  updateParams(params: { [key: string]: any }) {
    const curparams = this.params$.value;
    Object.assign(curparams, params);
    this.params$.next(curparams);
  }

  getArgumentIdWithVersion(argumentId: string, version: number) {
    return argumentId + this.ARGUMENT_VERSION_SEPARATOR + version;
  };

  override loadItems() {
    return combineLatest([this.page$, this.params$]).pipe(
      shareReplay(),
      switchMap(([page, paramsValue]) => {
        paramsValue.offset = (page - 1) * paramsValue.limit;
        return this.getItems(paramsValue);
      }),
      map((res: any) => {
        const params = this.params$.value;
        this.countTotal$.next(res.countTotal || res.count || 0);
        if (params.types?.length) {
          let totalCount = 0;
          let types = (!Array.isArray(params.types))? [params.types] : params.types;
          console.log(res);
          types.forEach((type) => totalCount += res.count[type]);
          this.countTotal$.next(totalCount);
        }
        this.totalPages$.next(Math.ceil(this.countTotal$.value / params.limit));
        this.hasMore$.next(true);
        if (this.totalPages$.value === 0 || this.totalPages$.value === this.page$.value) {
          this.hasMore$.next(false);
        }
        return Array.from<any>(res.rows);
      })
    );
  }
}
