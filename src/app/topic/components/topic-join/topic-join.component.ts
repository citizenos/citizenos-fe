import { TopicService } from '@services/topic.service';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, take, tap, combineLatest } from 'rxjs';
import { TopicJoinService } from '@services/topic-join.service';
import { LocationService } from '@services/location.service';
import { Topic } from 'src/app/interfaces/topic';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { AuthService } from '@services/auth.service';
import { AppService } from '@services/app.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'topic-join',
  templateUrl: './topic-join.component.html',
  styleUrls: ['./topic-join.component.scss']
})
export class TopicJoinComponent {
  topic: Topic;
  constructor(@Inject(DIALOG_DATA) data: any) {
    this.topic = data.topic;
  }
}

@Component({
  selector: 'topic-token-join',
  template: ''
})
export class TopicTokenJoinComponent {
  token: string = '';
  join$;
  constructor(router: Router, dialog: DialogService, route: ActivatedRoute, Location: LocationService, TopicJoinService: TopicJoinService, Auth: AuthService, app: AppService, TopicService: TopicService) {
    this.join$ = combineLatest([Auth.loggedIn$, Auth.user, route.params]).pipe(take(1), tap(([loggedIn, user, routeParams]: any) => {
      if (!user || user.id === null) {
        app.doShowLogin(Location.getAbsoluteUrl(router.url));
      } else if (user && !loggedIn) {
        console.log(user, loggedIn)
      } else {
        this.token = routeParams['token'];
        TopicJoinService
          .getByToken(this.token)
          .subscribe({
            next: (topic) => {
              if (topic.id && (topic.permission.level !== 'none' || topic.visibility === TopicService.VISIBILITY.public)) {
                router.navigate(['topics', topic.id]);
              }
              const joinDialog = dialog.open(TopicJoinComponent, {
                data: {
                  topic: topic
                }
              });
              joinDialog.afterClosed().subscribe((confirm) => {
                if (confirm === true) {
                  TopicJoinService.join(this.token).pipe(
                    take(1)
                  ).subscribe({
                    next: (topic) => {
                      TopicService.reloadTopic();
                      router.navigate(['topics', topic.id]);
                    },
                    error: (res) => {
                      const status = res.status;
                      if (status.code === 40100 && !Auth.loggedIn$.value) { // Unauthorized
                        const currentUrl = Location.getAbsoluteUrl(router.url);
                        router.navigate(['/account/login'], { queryParams: { redirectSuccess: currentUrl } });
                      } else if (status.code === 40001) { // Matching token not found.
                        router.navigate(['/']);
                      } else {
                        router.navigate(['/404']);
                      }
                    }
                  })
                } else if (topic.visibility !== TopicService.VISIBILITY.public) {
                  router.navigate(['/']);
                }
              });
            },
            error: (err) => {
              console.error('JOIN ERROR', err);
            }
          })
      }
    })).subscribe({
      error: (err) => console.error('Token join error', err)
    });
  }
}
