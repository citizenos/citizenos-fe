import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, take, tap } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { LocationService } from '@services/location.service';
import { NotificationService } from '@services/notification.service';
import { TopicInviteUserService } from '@services/topic-invite-user.service';
import { InvitationDialogComponent } from '@shared/components/invitation-dialog/invitation-dialog.component';
import { InviteDialogData } from '@interfaces/dialogdata';

@Component({
  selector: 'topic-invite-dialog',
  template: '',
})
export class TopicInvitationDialogComponent {
  inviteId: string = '';
  join$;

  constructor(
    Auth: AuthService,
    dialog: DialogService,
    TopicInviteUserService: TopicInviteUserService,
    route: ActivatedRoute,
    router: Router,
    Notification: NotificationService,
    Location: LocationService
  ) {
    function joinTopic(topicInvite: any) {
      TopicInviteUserService.accept(topicInvite)
        .pipe(take(1))
        .subscribe({
          next: () => {
            router.navigate(['/topics', topicInvite.topicId]);
          },
          error: (err) => {
            console.error('Invite error', err);
          },
        });
    }

    function showJoinDialog(topicInvite: any, currentUrl: string) {
      const data: InviteDialogData = {
        imageUrl: topicInvite.topic.imageUrl,
        title: topicInvite.topic.title,
        intro: topicInvite.topic.intro,
        description: topicInvite.topic.description,
        creator: topicInvite.creator,
        user: topicInvite.user,
        level: topicInvite.level,
        visibility: topicInvite.topic.visibility,
        currentUrl,
        publicAccess: {
          title: 'COMPONENTS.TOPIC_JOIN.BTN_GO_TO_TOPIC',
          link: ['/topics/', topicInvite.topic.id as string],
        },
      };
      const invitationDialog = dialog.open(InvitationDialogComponent, {
        /**
         * @todo Fix types.
         */
        data: data as unknown as Record<string, unknown>,
      });

      /**
       * @note Add a redirectSuccess query parameter to the login URL
       * to join the user to the topic directly after login.
       */
      let redirect = currentUrl;
      route.queryParams.subscribe((params) => {
        if (!params['join']) {
          redirect = `${redirect}?join=true`;
        }
      });

      const queryParams = {
        redirectSuccess: redirect,
        email: topicInvite.user.email,
      };

      invitationDialog.afterClosed().subscribe({
        next: (res) => {
          console.log('hwew!');
          if (res === true) {
            if (Auth.loggedIn$.value) {
              if (topicInvite.user.id !== Auth.user.value.id) {
                Auth.logout()
                  .pipe(take(1))
                  .subscribe(() => {
                    router.navigate(['/account/login'], {
                      queryParams: {
                        ...queryParams,
                        userId: topicInvite.user.id,
                      },
                    });
                  });
              } else {
                joinTopic(topicInvite);
              }
            } else {
              /**
               * @note This case works not as expected.
               * Or good to have an eye on this case.
               * @see topic-invite-user.service.ts
               */
              if (topicInvite.user.isRegistered) {
                router.navigate(['/account/login'], {
                  queryParams: {
                    ...queryParams,
                    userId: topicInvite.user.id,
                  },
                });
              } else {
                router.navigate(['/account', 'signup'], {
                  queryParams: {
                    ...queryParams,
                    inviteId: topicInvite.id,
                  },
                });
              }
            }
          }
        },
      });
    }

    this.join$ = combineLatest([
      Auth.loggedIn$,
      Auth.user,
      route.params,
      route.queryParams,
    ])
      .pipe(
        take(1),
        tap(([loggedIn, user, routeParams, queryParams]) => {
          this.inviteId = routeParams['inviteId'];
          TopicInviteUserService.get(routeParams).subscribe({
            next: (topicInvite) => {
              topicInvite.inviteId = this.inviteId;

              const joinTopicUrlForRedirect = Location.currentUrl();

              const hasDirectJoin =
                queryParams && queryParams['join'] === 'true';

              /**
               * @todo Implement userIsInTopic check.
               * Should be a boolean value returned from the API.
               *
               * Or redirect to the dashboard if the user is already in the topic.
               * Or show info toast.
               */
              const userIsInTopic = false;

              if (userIsInTopic) {
                router.navigate(['/topics', topicInvite.topicId]);
              } else if (topicInvite.user.id === user.id && hasDirectJoin) {
                if (loggedIn) {
                  joinTopic(topicInvite);
                }
              } else {
                router.navigate(['dashboard']);
                showJoinDialog(topicInvite, joinTopicUrlForRedirect);
              }
            },
            error: (err) => {
              router.navigate(['/']);
              setTimeout(() => {
                if (err.code === 41002 || err.status?.code === 41002) {
                  Notification.addError(
                    'MSG_ERROR_GET_API_USERS_TOPICS_INVITES_USERS_41002',
                    'MSG_ERROR_GET_API_USERS_TOPICS_INVITES_USERS_41002_HEADING'
                  );
                } else {
                  Notification.addError(err.message || err.status.message);
                }
              }, 400);
            },
          });
        })
      )
      .subscribe({
        error: (err) => console.error('Token join error', err),
      });
  }
}
