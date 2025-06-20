import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, take, tap } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { LocationService } from '@services/location.service';
import { NotificationService } from '@services/notification.service';
import { GroupInviteUserService } from '@services/group-invite-user.service';
import { InvitationDialogComponent } from '@shared/components/invitation-dialog/invitation-dialog.component';
import { InviteDialogData } from '@interfaces/dialogdata';
import { AppService } from '@services/app.service';

@Component({
  selector: 'group-invitation-dialog',
  template: '',
  standalone: false
})
export class GroupInvitationDialogComponent {
  inviteId: string = '';
  join$;

  constructor(
    Auth: AuthService,
    dialog: DialogService,
    GroupInviteUserService: GroupInviteUserService,
    route: ActivatedRoute,
    router: Router,
    Notification: NotificationService,
    Location: LocationService,
    app: AppService
  ) {
    function joinGroup(groupInvite: any) {
      GroupInviteUserService.accept(groupInvite)
        .pipe(take(1))
        .subscribe({
          next: () => {
            router.navigate(['groups', groupInvite.groupId]);
          },
          error: (err) => {
            Notification.addError(err.message || err.status.message);
            console.error('Invite error', err);
          },
        });
    }

    function showJoinDialog(invite: any, currentUrl: string) {
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
        email: invite.user.email,
      };

      const data: InviteDialogData = {
        imageUrl: invite.group.imageUrl,
        title: invite.group.name,
        intro: null,
        description: invite.group.description,
        creator: invite.creator,
        user: invite.user,
        level: invite.level,
        visibility: invite.group.visibility,
        publicAccess:
          invite.group.visibility === 'public'
            ? {
                title: 'COMPONENTS.GROUP_JOIN.BTN_GO_TO_GROUP',
                link: ['/groups/', invite.group.id as string],
              }
            : null,
        type: 'invite',
        view: 'group',
      };

      const invitationDialog = dialog.open(InvitationDialogComponent, {
        data: data as unknown as Record<string, unknown>,
      });

      invitationDialog.afterClosed().subscribe({
        next: (res) => {
          if (res === true) {
            if (Auth.loggedIn$.value) {
              if (invite.user.id !== Auth.user.value.id) {
                Auth.logout()
                  .pipe(take(1))
                  .subscribe(() => {
                    router.navigate(['/account/login'], {
                      queryParams: {
                        ...queryParams,
                        userId: invite.user.id,
                      },
                    });
                  });
              } else {
                joinGroup(invite);
              }
            } else {
              /**
               * @note This case works not as expected.
               * Or good to have an eye on this case.
               * @see group-invite-user.service.ts
               */
              if (invite.user.isRegistered) {
                router.navigate(['/account/login'], {
                  queryParams: {
                    ...queryParams,
                    userId: invite.user.id,
                  },
                });
              } else {
                router.navigate(['/account', 'signup'], {
                  queryParams: {
                    ...queryParams,
                    inviteId: invite.id,
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
          GroupInviteUserService.get(routeParams).subscribe({
            next: (groupInvite) => {
              groupInvite.inviteId = this.inviteId;

              const joinUrlForRedirect = Location.currentUrl();

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
                router.navigate(['/groups', groupInvite.topicId]);
              } else if (groupInvite.user.id === user.id && hasDirectJoin) {
                if (loggedIn) {
                  joinGroup(groupInvite);
                } else if (!user.isAuthenticated) {
                  app.doNavigateLogin({
                    redirectSuccess: joinUrlForRedirect,
                  });
                }
              } else {
                router.navigate(['dashboard']);
                showJoinDialog(groupInvite, joinUrlForRedirect);
              }
            },
            error: (err) => {
              router.navigate(['/']);
              setTimeout(() => {
                console.log(err);
                if (err.code === 41002 || err.status?.code === 41002) {
                  Notification.addError(
                    'MSG_ERROR_GET_API_USERS_GROUPS_INVITES_USERS_41002',
                    'MSG_ERROR_GET_API_USERS_GROUPS_INVITES_USERS_41002_HEADING'
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
