import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, take } from 'rxjs';
import { TopicJoinService } from 'src/app/services/topic-join.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-topic-join',
  template: ''
})
export class TopicJoinComponent implements OnInit {
  token: string = '';
  constructor(router: Router, route: ActivatedRoute, Location: LocationService, TopicJoinService: TopicJoinService) {
    route.params.pipe(
      switchMap((params: any) => {
        this.token = params['token'];
        return TopicJoinService
          .getByToken(params['token'])
      }),
      take(1)
    ).subscribe({
      next: (topic) => {
        console.log('TOPIC', topic);
        router.navigate(['topics', topic.id]);
      },
      error: () => {
        TopicJoinService.join(this.token).pipe(take(1))
          .subscribe({
            next: (topic) => {
              router.navigate(['topics', topic.id]);
            },
            error: (res) => {
              const status = res.status;
              if (status.code === 40100) { // Unauthorized
                const currentUrl = Location.currentUrl();
                router.navigate(['/account/login'], {queryParams: { redirectSuccess: currentUrl }});
              } else if (status.code === 40001) { // Matching token not found.
                router.navigate(['/']);
              } else {
                router.navigate(['/404']);
              }
            }
          })
      }
    })
  }

  ngOnInit(): void {
  }

}
