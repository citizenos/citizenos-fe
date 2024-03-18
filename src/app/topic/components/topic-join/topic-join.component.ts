import { TopicService } from 'src/app/services/topic.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, take } from 'rxjs';
import { TopicJoinService } from 'src/app/services/topic-join.service';
import { LocationService } from 'src/app/services/location.service';
import { Topic } from 'src/app/interfaces/topic';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-topic-join',
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
  selector: 'app-group-join',
  template: ''
})
export class TopicTokenJoinComponent {
  token: string = '';
  constructor(router: Router, dialog: DialogService, route: ActivatedRoute, Location: LocationService, TopicJoinService: TopicJoinService, Auth: AuthService, app: AppService, TopicService: TopicService) {
    if (!Auth.loggedIn$.value) {
      app.doShowLogin(Location.getAbsoluteUrl(router.url));
    } else {
      route.params.pipe(
        switchMap((params: any) => {
          this.token = params['token'];
          return TopicJoinService
            .getByToken(params['token'])
        }),
        take(1)
      ).subscribe({
        next: (topic) => {
          if (topic.id && (topic.permission.level !== 'none' || topic.visibility === TopicService.VISIBILITY.public )) {
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
                  if (status.code === 40100) { // Unauthorized
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
          console.log(err);
          /* const joinDialog = dialog.open(TopicJoinComponent, {
             data: {
               topic: {id: '', title: ''}
             }
           });
           joinDialog.afterClosed().subscribe((confirm) => {
             if (confirm === true) {
               TopicJoinService.join(this.token).pipe(
                 take(1)
               ).subscribe({
                 next: (topic) => {
                   router.navigate(['topics', topic.id]);
                 },
                 error: (res) => {
                   const status = res.status;
                   if (status.code === 40100) { // Unauthorized
                     const currentUrl = Location.currentUrl();
                     router.navigate(['/account/login'], { queryParams: { redirectSuccess: currentUrl } });
                   } else if (status.code === 40001) { // Matching token not found.
                     router.navigate(['/']);
                   } else {
                     router.navigate(['/404']);
                   }
                 }
               })
             }
           });*/
          /*TopicJoinService.join(this.token).pipe(take(1))
            .subscribe({
              next: (topic) => {
                router.navigate(['topics', topic.id]);
              },
              error: (res) => {
                const status = res.status;
                if (status.code === 40100) { // Unauthorized
                  const currentUrl = Location.currentUrl();
                  router.navigate(['/account/login'], { queryParams: { redirectSuccess: currentUrl } });
                } else if (status.code === 40001) { // Matching token not found.
                  router.navigate(['/']);
                } else {
                  router.navigate(['/404']);
                }
              }
            })*/
        }
      });
    }
  }
}
