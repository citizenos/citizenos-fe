import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { LocationService } from './location.service';
import { Observable, switchMap, of } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
@Injectable({
  providedIn: 'root'
})
export class TopicService {
  public CATEGORIES = {
    biotoopia: "biotoopia",
    citizenos: "citizenos",
    eestijazziarengusuunad: 'eestijazziarengusuunad', // Special project with http://www.jazz.ee/ - https://github.com/citizenos/citizenos-api/issues/73
    eurochangemakers: 'eurochangemakers',
    hacktivistcommunity: 'hacktivistcommunity',
    opinionfestival: 'opinionfestival',
    pyln: 'pyln',
    thetwelvemovie: 'thetwelvemovie',
    thirtyfourislandproject: 'thirtyfourislandproject',
    business: 'business', // Business and industry
    transport: 'transport', // Public transport and road safety
    taxes: 'taxes', // Taxes and budgeting
    agriculture: 'agriculture', // Agriculture
    environment: 'environment', // Environment, animal protection
    culture: 'culture', // Culture, media and sports
    health: 'health', // Health care and social care
    work: 'work', // Work and employment
    education: 'education', // Education
    politics: 'politics', // Politics and public administration
    communities: 'communities', // Communities and urban development
    defense: 'defense', //  Defense and security
    integration: 'integration', // Integration and human rights
    youth: 'youth', //Youth
    science: 'science', //Science and Technology
    society: 'society', //Democracy and civil society
    varia: 'varia' // Varia
  };

  public STATUSES = {
    inProgress: 'inProgress', // Being worked on
    voting: 'voting', // Is being voted which means the Topic is locked and cannot be edited.
    followUp: 'followUp', // Done editing Topic and executing on the follow up plan.
    closed: 'closed' // Final status - Topic is completed and no editing/reopening/voting can occur.
  };

  constructor(private Location: LocationService, private http: HttpClient) { }

  get(id: string, params?: { [key:string]: string }): Observable<Topic>  {
      let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId', {topicId: id});

      return this.http.get<Topic>(path, {withCredentials: true, params, observe: 'body', responseType: 'json' })
          .pipe(switchMap((res: any) => {
            const topic = res.data;
            return of(topic);
          }))
  }

  queryPublic(params: {[key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/topics');
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { params: queryParams, observe: 'body', responseType: 'json' } );
  };

  query(params: {[key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics');
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' } );
  };
}
