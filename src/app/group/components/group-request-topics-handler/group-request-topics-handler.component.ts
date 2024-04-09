import { LocationService } from 'src/app/services/location.service';
import { NotificationService } from 'src/app/services/notification.service';
import { combineLatest, map, take } from 'rxjs';
import { GroupRequestTopicService } from 'src/app/services/group-request-topic.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { DialogService } from 'src/app/shared/dialog';
import { LoginDialogComponent } from 'src/app/account/components/login/login.component';

@Component({
  template: '',
  selector: 'app-group-request-topics-handler'
})
export class GroupRequestTopicsHandlerComponent {

  constructor(
    router: Router,
    route: ActivatedRoute,
    Request: GroupRequestTopicService,
    NotificationService: NotificationService,
    Auth: AuthService,
    app: AppService,
    dialog: DialogService
  ) {
    combineLatest([route.url, route.params]).pipe((take(1)), map(([url, params]) => {
      const curPath = url.join('');
      const acceptMessage = 'MSG_REQUEST_ACCEPTED';
      const rejectMessage = 'MSG_REQUEST_REJECTED';

      Request.get(params).pipe(take(1)).subscribe({
        next: (request) => {
          const acceptPath = ['topics', request.topicId];
          const rejectPath = ['groups', request.groupId];
          const redirect = (path: any[], message: string) => {
            router.navigate(path);
            setTimeout(() => {
              if ((request.acceptedAt || request.rejectAt) && new Date().getTime() - new Date(request.acceptedAt || request.rejectedAt).getTime() > 60000) {
                NotificationService.addWarning(message + '_ALREADY');
              } else {
                NotificationService.addSuccess(message);
              }
            }, 1000)
          }

          if (request.acceptedAt) {
            return redirect(acceptPath, acceptMessage);
          } else if (request.rejectedAt) {
            return redirect(rejectPath, rejectMessage);
          } else if (curPath === 'accept') {
            Request.accept(request).pipe(take(1)).subscribe(() => {
              return redirect(acceptPath, acceptMessage);
            });
          } else if (curPath === 'reject') {
            Request.reject(request).pipe(take(1)).subscribe(() => {
              return redirect(rejectPath, rejectMessage);
            });
          }
        },
        error: (err) => {
          if (!Auth.loggedIn$.value) {
            router.navigate(['groups', params['groupId']]);
            dialog.closeAll();
            app.doShowLogin(location.href);
          }
        }
      });
    })).subscribe();
  }
}
