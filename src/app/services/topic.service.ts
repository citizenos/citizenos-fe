import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { LocationService } from './location.service';
import { Observable, switchMap, map, of, take, BehaviorSubject, exhaustMap, shareReplay } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  public CATEGORIES = <any>{
    biotoopia: 'biotoopia',
    citizenos: 'citizenos',
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

  public STATUSES = <any>{
    inProgress: 'inProgress', // Being worked on
    voting: 'voting', // Is being voted which means the Topic is locked and cannot be edited.
    followUp: 'followUp', // Done editing Topic and executing on the follow up plan.
    closed: 'closed' // Final status - Topic is completed and no editing/reopening/voting can occur.
  };

  public VISIBILITY = <any>{
    public: 'public', // Everyone has read-only on the Topic.  Pops up in the searches..
    private: 'private' // No-one can see except collaborators
  };

  public LEVELS = <any>{
    read: 'read',
    edit: 'edit',
    admin: 'admin'
  };
  CATEGORIES_COUNT_MAX = 3;

  private loadTopic$ = new BehaviorSubject<void>(undefined);

  constructor(private dialog: MatDialog, private Location: LocationService, private http: HttpClient, private Auth: AuthService, private router: Router) { }

  loadTopic(id: string, params?: { [key: string]: string | boolean }) {
    return this.loadTopic$.pipe(
      exhaustMap(() => this.get(id, params)),
      shareReplay()
    );
  }

  reloadTopic(): void {
    this.loadTopic$.next();
  }

  get(id: string, params?: { [key: string]: string | boolean }): Observable<Topic> {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId'), { topicId: id });
    return this.http.get<ApiResponse>(path, { withCredentials: true, params, observe: 'body', responseType: 'json' })
      .pipe(switchMap((res: any) => {
        const topic = res.data;
        return of(topic);
      }))
  }

  count() {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/count');

    return this.http.get<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(map(res => res.data));
  }

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics')

    return this.http.post<ApiResponse>(path, data, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  update(data: any) {
    const updateFields = ['visibility', 'status', 'categories', 'endsAt', 'hashtag', 'imageUrl', 'title', 'intro', 'contact', 'country', 'language'];
    const sendData: any = {};

    updateFields.forEach((field) => {
      if (field in data) {
        sendData[field] = data[field];
      }
    });

    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId', { topicId: data.id || data.topicId });

    return this.http.put<ApiResponse>(path, sendData, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res.data)
      );
  }

  patch(data: any) {
    const updateFields = ['title', 'visibility', 'status', 'categories', 'endsAt', 'hashtag','imageUrl', 'intro', 'contact', 'country', 'language'];
    const sendData: any = {};

    updateFields.forEach((field) => {
      if (field in data) {
        sendData[field] = data[field];
      }
    });

    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId', { topicId: data.id || data.topicId });

    return this.http.patch<ApiResponse>(path, sendData, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(
        map(res => res)
      );
  }

  query(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics');
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' })
      .pipe(switchMap((res: any) => {
        const topic = res.data;
        return of(topic);
      }))
  };

  delete(data: any) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId', { topicId: data.id || data.topicId });

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(map(res => res.data));
  }

  duplicate(data: any) {
    if (!data.topicId) data.topicId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/duplicate', data);

    return this.http.get<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' })
      .pipe(map(res => res.data));
  };

  addToFavourites(topicId: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/favourite', { topicId: topicId });

    return this.http.post<ApiResponse>(path, {}, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  removeFromFavourites(topicId: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/favourite', { topicId: topicId });

    return this.http.delete<ApiResponse>(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(res => res.data)
    );
  }

  download(topicId: string) {
    return this.Location.getAbsoluteUrlApi('/api/topics/:topicId/download', { topicId });
  }

  toggleFavourite(topic: Topic) {
    if (!topic.favourite) {
      return this.addToFavourites(topic.id).pipe(take(1)).subscribe(() => {
        topic.favourite = true;
      });
    } else {
      return this.removeFromFavourites(topic.id).pipe(take(1)).subscribe(() => {
        topic.favourite = false;
      });
    }
  };

  isPrivate(topic: Topic) {
    return topic && topic.visibility === this.VISIBILITY.private;
  };

  canUpdate(topic: Topic) {
    return (topic && topic.permission && topic.permission.level === this.LEVELS.admin && topic.status !== this.STATUSES.closed);
  };

  changeState(topic: Topic, state: string, stateSuccess?: string) {
    const templates = <any>{
      followUp: {
        level: 'delete',
        heading: 'MODALS.TOPIC_SEND_TO_FOLLOWUP_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_SEND_TO_FOLLOWUP_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.USER_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.TOPIC_SEND_TO_FOLLOWUP_CONFIRM_TXT_NO_EDIT', 'MODALS.TOPIC_SEND_TO_FOLLOWUP_CONFIRM_TXT_NO_VOTE'],
        confirmBtn: 'MODALS.TOPIC_SEND_TO_FOLLOWUP_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.TOPIC_SEND_TO_FOLLOWUP_CONFIRM_BTN_NO'
      },
      closed: {
        level: 'delete',
        heading: 'MODALS.TOPIC_CLOSE_CONFIRM_HEADING_CLOSE_TOPIC',
        title: 'MODALS.TOPIC_CLOSE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.TOPIC_CLOSE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.TOPIC_CLOSE_CONFIRM_TXT_NO_EDIT', 'MODALS.TOPIC_CLOSE_CONFIRM_TXT_NO_VOTE'],
        closeBtn: 'MODALS.TOPIC_CLOSE_CONFIRM_BTN_NO',
        confirmBtn: 'MODALS.TOPIC_CLOSE_CONFIRM_BTN_YES'
      },
      vote: {
        heading: 'MODALS.TOPIC_SEND_TO_VOTE_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_SEND_TO_VOTE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.USER_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.TOPIC_SEND_TO_VOTE_CONFIRM_TXT_NO_EDIT'],
        confirmBtn: 'MODALS.TOPIC_SEND_TO_VOTE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.TOPIC_SEND_TO_VOTE_CONFIRM_BTN_NO'
      }
    }

    const confirm = this.dialog.open(ConfirmDialogComponent, {
      data: templates[state]
    });
    confirm.afterClosed().subscribe((res) => {
      if (res === true) {
        this.patch({
          id: topic.id,
          status: this.STATUSES[state]
        }).pipe(take(1))
          .subscribe({
            next: () => {
              if (state === 'vote' && !topic.voteId && !topic.vote) {
                this.router.navigate(['/topics', topic.id, 'votes', 'create'])
              }
              this.reloadTopic();
              if (state === 'followUp') {
                this.router.navigate(['/topics', topic.id], {fragment:'followUp'})
              }
              this.dialog.closeAll();
            }, error: (res) => {
              console.error(res);
            }
          })

      }
    });
  }
  /**
   * Can one edit Topics settings and possibly description (content)?
   * Use canEditDescription() if you only need to check if content can be edited.
   *
   * @returns {boolean}
   *
   */
  canEdit(topic: Topic) {
    return (topic && [this.LEVELS.admin, this.LEVELS.edit].indexOf(topic.permission.level) > -1 && topic.status !== this.STATUSES.closed);
  };

  /**
   * Can one edit Topics description (content)?
   *
   * @returns {boolean}
   *
   */
  canEditDescription(topic: Topic) {
    return this.canEdit(topic) && topic.status === this.STATUSES.inProgress;
  };

  canDelete(topic: Topic) {
    return (topic && topic.permission.level === this.LEVELS.admin);
  };

  canSendToFollowUp(topic: Topic) {
    return this.canUpdate(topic) && topic.vote && topic.vote.id && topic.status !== this.STATUSES.followUp;
  };

  canSendToVote(topic: Topic) {
    return this.canUpdate(topic) && [this.STATUSES.voting, this.STATUSES.followUp, this.STATUSES.closed].indexOf(topic.status) < 0;
  };

  canLeave() {
    return this.Auth.loggedIn$.value;
  };

  canShare(topic: Topic) {
    return topic && (!this.isPrivate(topic) || this.canUpdate(topic));
  }

  doDeleteTopic(topic: Topic, redirect: string[]) {
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_DELETE_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.TOPIC_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.TOPIC_DELETE_CONFIRM_TXT_TOPIC_DELETED', 'MODALS.TOPIC_DELETE_CONFIRM_TXT_DISCUSSION_DELETED', 'MODALS.TOPIC_DELETE_CONFIRM_TXT_TOPIC_REMOVED_FROM_GROUPS'],
        confirmBtn: 'MODALS.TOPIC_DELETE_CONFIRM_YES',
        closeBtn: 'MODALS.TOPIC_DELETE_CONFIRM_NO'
      }
    });
    deleteDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete(topic)
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate(redirect);
          })
      }
    });
  };
}
