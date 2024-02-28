import { GroupService } from './../../../services/group.service';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { GroupJoinService } from 'src/app/services/group-join.service';
import { LocationService } from 'src/app/services/location.service';
import { Group } from 'src/app/interfaces/group';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';

@Component({
  selector: 'app-group-join',
  templateUrl: './group-join.component.html',
  styleUrls: ['./group-join.component.scss']
})
export class GroupJoinComponent {
  group: Group;
  constructor(@Inject(DIALOG_DATA) data: any) {
    this.group = data.group;
  }

}

@Component({
  selector: 'app-group-join',
  template: ''
})
export class GroupTokenJoinComponent {
  token: string = '';
  constructor(router: Router, dialog: DialogService, route: ActivatedRoute, Location: LocationService, GroupJoinService: GroupJoinService, GroupService: GroupService) {
    route.params.pipe(
      switchMap((params: any) => {
        this.token = params['token'];
        if (this.token) {
          return GroupJoinService.get(this.token)
        } else {
          return GroupService.get(params['groupId'])
        }
      }), take(1))
      .subscribe({
        next: (group) => {
          if (group.userLevel) {
            router.navigate(['/groups', group.id]);
          } else {

            const joinDialog = dialog.open(GroupJoinComponent, {
              data: {
                group: group,
                token: this.token
              }
            });

            joinDialog.afterClosed().subscribe((confirm) => {
              if (confirm === true) {
                if (this.token) {
                  GroupJoinService.join(this.token).pipe(
                    take(1)
                  ).subscribe({
                    next: (group) => {
                      router.navigate(['/groups', group.id]);
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
                } else {
                  GroupJoinService.joinPublic(group.id).pipe(
                    take(1)
                  ).subscribe({
                    next: (group) => {
                      router.navigate(['/groups', group.id]);
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
              }
            });
          }
        },
        error: (err) => {
          console.error("Group join error", err);
          if (err.status?.code === 40400) router.navigate(['/404']);
        }
      });
  }
}
