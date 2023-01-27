import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { LocationService } from './location.service';
import { Observable, switchMap, map, of, take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
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

  public VISIBILITY = {
    public: 'public', // Everyone has read-only on the Topic.  Pops up in the searches..
    private: 'private' // No-one can see except collaborators
  };

  public LEVELS = {
    read: 'read',
    edit: 'edit',
    admin: 'admin'
  };

  constructor(private dialog: MatDialog, private Location: LocationService, private http: HttpClient, private Auth: AuthService, private router: Router) { }

  get(id: string, params?: { [key: string]: string }): Observable<Topic> {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId'), { topicId: id });
    return this.http.get<Topic>(path, { withCredentials: true, params, observe: 'body', responseType: 'json' })
      .pipe(switchMap((res: any) => {
        const topic = res.data;
        return of(topic);
      }))
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
      .pipe(map((res) => { return res.data }));
  }

  addToPinned(topicId: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/pin', { topicId: topicId });

    return this.http.post(path, {}, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(((res: any) => { return res.data }))
    )
  }

  removeFromPinned(topicId: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/pin', { topicId: topicId });

    return this.http.delete(path, { withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map(((res: any) => { return res.data }))
    )
  }

  togglePin(topic: Topic) {
    if (!topic.pinned) {
      return this.addToPinned(topic.id).pipe(take(1)).subscribe(() => {
        topic.pinned = true;
      });
    } else {
      return this.removeFromPinned(topic.id).pipe(take(1)).subscribe(() => {
        topic.pinned = false;
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
    /*const templates = {
      followUp: '/views/modals/topic_send_to_followUp_confirm.html',
      vote: '/views/modals/topic_close_confirm.html',
      closed: '/views/modals/topic_close_confirm.html'
    };
    const nextStates = {
      followUp: 'topics/view/followUp',
      vote: 'topics/view/votes/view',
      closed: 'topics/view'
    };

    this.ngDialog
      .openConfirm({
        template: templates[state]
      })
      .then(() => {
        if (state === 'vote' && !topic.voteId && !topic.vote) {
          this.$state.go('topics/view/votes/create', {
            topicId: topic.id,
            commentId: null
          }, { reload: true });
          return;
        }

        return this.patch({
          id: topic.id,
          status: this.STATUSES[state]
        });
      })
      .then(() => {
        const stateNext = stateSuccess || nextStates[state];
        const stateParams = angular.extend({}, this.$stateParams, {
          editMode: null,
          commentId: null
        });
        this.$state.go(
          stateNext,
          stateParams,
          {
            reload: true
          }
        );
      }, angular.noop);*/
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
  /*
    canDelegate (topic: Topic) {
        return (this.canVote(topic) && topic.vote.delegationIsAllowed === true);
    };*/
  canSendToFollowUp(topic: Topic) {
    return this.canUpdate(topic) && topic.vote && topic.vote.id && topic.status !== this.STATUSES.followUp;
  };

  canSendToVote(topic: Topic) {
    return this.canUpdate(topic) && [this.STATUSES.voting, this.STATUSES.closed].indexOf(topic.status) < 0;
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
