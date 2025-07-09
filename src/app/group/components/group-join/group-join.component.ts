import { GroupService } from '@services/group.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, take, tap } from 'rxjs';
import { GroupJoinService } from '@services/group-join.service';
import { LocationService } from '@services/location.service';
import { Group } from 'src/app/interfaces/group';
import { DialogService } from 'src/app/shared/dialog';
import { AppService } from '@services/app.service';
import { AuthService } from '@services/auth.service';
import { InvitationDialogComponent } from '@shared/components/invitation-dialog/invitation-dialog.component';
import { InviteDialogData } from '@interfaces/dialogdata';

@Component({
  selector: 'group-token-join',
  template: '',
  standalone: false
})
export class GroupTokenJoinComponent {
  token: string = '';
  join$;

  constructor(
    router: Router,
    dialog: DialogService,
    route: ActivatedRoute,
    Location: LocationService,
    GroupJoinService: GroupJoinService,
    GroupService: GroupService,
    app: AppService,
    Auth: AuthService
  ) {
    function joinGroup(group: Group, token: string, redirectSuccess?: string) {
      /**
       * @note Add a redirectSuccess query parameter to the login URL
       * to join the user to the topic directly after login.
       */
      let redirect = redirectSuccess;
      route.queryParams.subscribe((params) => {
        if (!params['join']) {
          redirect = `${redirect}?join=true`;
        }
      });

      if (token) {
        GroupJoinService.join(token)
          .pipe(take(1))
          .subscribe({
            next: (group) => {
              router.navigate(['/groups', group.id]);
            },
            error: (res) => {
              const status = res.status;
              if (status.code === 40100) {
                // Unauthorized
                app.doNavigateLogin({ redirectSuccess: redirect });
              } else if (status.code === 40001) {
                // Matching token not found.
                router.navigate(['dashboard']);
              } else {
                router.navigate(['/404']);
              }
            },
          });
      } else {
        GroupJoinService.joinPublic(group.id)
          .pipe(take(1))
          .subscribe({
            next: (group) => {
              router.navigate(['/groups', group.id]);
            },
            error: (res) => {
              const status = res.status;
              if (status.code === 40100) {
                // Unauthorized
                app.doNavigateLogin({
                  redirectSuccess: redirect,
                  groupId: group.id,
                });
              } else if (status.code === 40001) {
                // Matching token not found.
                router.navigate(['dashboard']);
              } else {
                router.navigate(['/404']);
              }
            },
          });
      }
    }

    function showJoinDialog(
      group: Group,
      token: string,
      redirectSuccess?: string
    ) {
      const data: InviteDialogData = {
        imageUrl: group.imageUrl,
        title: group.name,
        intro: null,
        description: group.description,
        creator: group.creator,
        user: null,
        /**
         * @note Hardcode level to read as the API returns
         * topic object, but not invitation object.
         *
         * @todo Keep eye on it and fix on API level if needed.
         */
        level: 'read',
        visibility: group.visibility,
        publicAccess:
          group.visibility === 'public'
            ? {
                title: 'COMPONENTS.GROUP_JOIN.BTN_GO_TO_GROUP',
                link: ['/groups/', group.id as string],
              }
            : null,
        type: 'join',
        view: 'group',
      };

      const joinDialog = dialog.open(InvitationDialogComponent, {
        data: data as unknown as Record<string, unknown>,
      });

      joinDialog.afterClosed().subscribe((confirm) => {
        if (confirm === true) {
          joinGroup(group, token, redirectSuccess);
        }
      });
    }

    this.join$ = combineLatest([
      Auth.user,
      Auth.loggedIn$,
      route.params,
      route.queryParams,
    ])
      .pipe(
        take(1),
        tap(([user, loggedIn, routeParams, queryParams]) => {
          this.token = routeParams['token'];
          let service: Observable<Group> | null = null

          if (this.token) {
            service = GroupJoinService.get(this.token)
          } else {
            service = GroupService.get(routeParams['groupId'])
          }

          service.subscribe({
            next: (group) => {
              const userIsInGroup = group.userLevel;
              const groupId = group.id;
              const redirectSuccess = Location.currentUrl();

              const hasDirectJoin =
                queryParams && queryParams['join'] === 'true';

              if (userIsInGroup) {
                router.navigate(['/groups', groupId]);
              } else if (hasDirectJoin) {
                if (loggedIn) {
                  joinGroup(group, this.token, redirectSuccess);
                } else if (!user.isAuthenticated) {
                  app.doNavigateLogin({
                    redirectSuccess,
                  });
                }
              } else {
                router.navigate(['dashboard']);
                showJoinDialog(group, this.token, redirectSuccess);
              }
            },
            error: (err) => {
              console.error('Group join error', err);
              if (err.status?.code === 40400) router.navigate(['/404']);
            },
          });
        })
      )
      .subscribe({
        error: (err) => console.error('Token join error', err),
      });
  }
}
