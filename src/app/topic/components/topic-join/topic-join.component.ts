import { TopicService } from '@services/topic.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, tap, combineLatest } from 'rxjs';
import { TopicJoinService } from '@services/topic-join.service';
import { LocationService } from '@services/location.service';
import { Topic } from 'src/app/interfaces/topic';
import { DialogService } from 'src/app/shared/dialog';
import { AuthService } from '@services/auth.service';
import { AppService } from '@services/app.service';
import { InvitationDialogComponent } from '@shared/components/invitation-dialog/invitation-dialog.component';
import { InviteDialogData } from '@interfaces/dialogdata';

@Component({
  selector: 'topic-token-join',
  template: '',
})
export class TopicTokenJoinComponent {
  token: string = '';
  join$;
  constructor(
    router: Router,
    dialog: DialogService,
    route: ActivatedRoute,
    Location: LocationService,
    TopicJoinService: TopicJoinService,
    Auth: AuthService,
    app: AppService,
    TopicService: TopicService
  ) {
    function joinTopic(token: string, redirectSuccess?: string) {
      TopicJoinService.join(token)
        .pipe(take(1))
        .subscribe({
          next: (topic) => {
            TopicService.reloadTopic();
            router.navigate(['topics', topic.id]);
          },
          error: (res) => {
            const status = res.status;
            if (status.code === 40100 && !Auth.loggedIn$.value) {
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

              app.doNavigateLogin({
                redirectSuccess: redirect,
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

    function showJoinDialog(
      topic: Topic,
      token: string,
      redirectSuccess: string
    ) {
      console.log(topic);
      const data: InviteDialogData = {
        imageUrl: topic.imageUrl,
        title: topic.title,
        intro: topic.intro,
        description: topic.description,
        creator: topic.creator,
        user: null,
        /**
         * @note Hardcode level to read as the API returns
         * topic object, but not invitation object.
         *
         * @todo Keep eye on it and fix on API level if needed.
         */
        level: TopicService.LEVELS.read,
        visibility: topic.visibility,
        publicAccess:
          topic.visibility === 'public'
            ? {
                title: 'COMPONENTS.TOPIC_JOIN.BTN_GO_TO_TOPIC',
                link: ['/topics/', topic.id as string],
              }
            : null,
        type: 'join',
      };
      const joinDialog = dialog.open(InvitationDialogComponent, {
        data: data as unknown as Record<string, unknown>,
      });

      joinDialog.afterClosed().subscribe((confirm) => {
        if (confirm === true) {
          joinTopic(token, redirectSuccess);
        } else if (topic.visibility !== TopicService.VISIBILITY.public) {
          router.navigate(['dashboard']);
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
          TopicJoinService.get(this.token).subscribe({
            next: (topic) => {
              const topicId = topic.id;

              const userIsInTopic =
                topic.permission && topic.permission.level !== 'none';

              const joinTopicUrlForRedirect = Location.currentUrl();

              const hasDirectJoin =
                queryParams && queryParams['join'] === 'true';

              if (userIsInTopic) {
                router.navigate(['/topics', topicId]);
              } else if (hasDirectJoin) {
                if (loggedIn) {
                  joinTopic(this.token);
                } else if (!user.isAuthenticated) {
                  app.doNavigateLogin({
                    redirectSuccess: joinTopicUrlForRedirect,
                  });
                }
              } else {
                router.navigate(['dashboard']);
                showJoinDialog(topic, this.token, joinTopicUrlForRedirect);
              }
            },
            error: (err) => {
              console.error('JOIN ERROR', err);
            },
          });
        })
      )
      .subscribe({
        error: (err) => console.error('Token join error', err),
      });
  }
}
