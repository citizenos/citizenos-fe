import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, take } from 'rxjs';
import { GroupJoinService } from 'src/app/services/group-join.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-group-join',
  template: '',
})
export class GroupJoinComponent implements OnInit {

  constructor(router: Router, route: ActivatedRoute, Location: LocationService, GroupJoinService: GroupJoinService) {
    route.params.pipe(
      switchMap((params: any) => {
        return GroupJoinService
          .join(params['token'])
      }),
      take(1)
    ).subscribe({
      next: (group) => {
        router.navigate(['/my/groups', group.id]);
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

  ngOnInit(): void {
  }

}
