import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Argument } from 'src/app/interfaces/argument';
import { Observable, BehaviorSubject, map, distinct, catchError, EMPTY } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class TopicArgumentService {
  private defaultParams = {
    topicId: <string | null> null,
    orderBy: <string | null> null,
    sortOrder: <string | null> null,
    offset: <number> 0,
    limit: <number> 8,
  };

  params$ = new BehaviorSubject(this.defaultParams);

  private ARGUMENT_TYPES = {
    pro: 'pro',
    con: 'con',
    poi: 'poi',
    reply: 'reply'
  };

  private ARGUMENT_SUBJECT_MAXLENGTH = 128;

  private ARGUMENT_TYPES_MAXLENGTH = {
      pro: 2048,
      con: 2048,
      poi: 500,
      reply: 2048
  };

  private ARGUMENT_REPORT_TYPES = {
      abuse: 'abuse', // is abusive or insulting
      obscene: 'obscene', // contains obscene language
      spam: 'spam', // contains spam or is unrelated to topic
      hate: 'hate', // contains hate speech
      netiquette: 'netiquette', // infringes (n)etiquette
      duplicate: 'duplicate' // duplicate
  };

  private ARGUMENT_ORDER_BY = {
  //    rating: 'rating', removed 23.12.2022
      popularity: 'popularity',
      date: 'date'
  };
  count = new BehaviorSubject({
    total: 0,
    con: 0,
    pro: 0,
    poi: 0,
    reply: 0
  });

  countTotal$ = new BehaviorSubject(0);
  constructor(private http: HttpClient, private Location: LocationService, private Auth: AuthService) { }

  query(params: {[key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/topics/:topicId/comments', params);

    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { params: queryParams, observe: 'body', responseType: 'json' } );
  }

  getArguments(params?: any | null) {
    return this.query(params).pipe(
      map((res: ApiResponse) => {
        console.log(res.data);
        this.countTotal$.next(res.data.countTotal || 0);
        this.count.next(res.data.count);
        return Array.from<Argument>(res.data.rows);
      }),
      distinct(),
      catchError(() => EMPTY)
    );
  }

  updateParams(params: {[key: string]: any }) {
    const curparams = this.params$.value;
    Object.assign(curparams, params);
    this.params$.next(curparams);
  }
}
