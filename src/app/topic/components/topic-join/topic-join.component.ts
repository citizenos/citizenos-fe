import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, take } from 'rxjs';
import { TopicJoinService } from 'src/app/services/topic-join.service';
import { LocationService } from 'src/app/services/location.service';
import { Topic } from 'src/app/interfaces/topic';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-topic-join',
  templateUrl: './topic-join.component.html',
  styleUrls: ['./topic-join.component.scss']
})
export class TopicJoinComponent {
  topic: Topic;
  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.topic = data.topic;
  }
}

@Component({
  selector: 'app-group-join',
  template: ''
})
export class TopicTokenJoinComponent {
  token: string = '';
  constructor(router: Router, dialog: MatDialog, route: ActivatedRoute, Location: LocationService, TopicJoinService: TopicJoinService) {
    route.params.pipe(
      switchMap((params: any) => {
        this.token = params['token'];
        return TopicJoinService
          .getByToken(params['token'])
      }),
      take(1)
    ).subscribe({
      next: (topic) => {
        console.log(topic);
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
        });
      },
      error: (err) => {
        console.error(err);
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
    })

  }
}