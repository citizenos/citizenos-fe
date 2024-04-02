import { NotificationService } from 'src/app/services/notification.service';
import { combineLatest, map, take } from 'rxjs';
import { GroupRequestTopicService } from 'src/app/services/group-request-topic.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-request-topics-handler',
  templateUrl: './group-request-topics-handler.component.html',
  styleUrls: ['./group-request-topics-handler.component.scss']
})
export class GroupRequestTopicsHandlerComponent {

  constructor(router: Router, route: ActivatedRoute, Request: GroupRequestTopicService, NotificationService: NotificationService) {
    combineLatest([route.url, route.params ]).pipe((take(1)), map(([url, params]) => {
      Request.get(params).pipe(take(1)).subscribe((request) => {
        const curPath = url.join('');
        if(curPath === 'accept') {
          if (request.acceptedAt) {
            router.navigate(['topics', request.topicId]);
            setTimeout(() => {
              if (new Date().getTime() - new Date(request.acceptedAt).getTime() > 10000) {
                NotificationService.addWarning('MSG_REQUEST_ACCEPTED_ALREADY');
              } else {
                NotificationService.addSuccess('MSG_REQUEST_ACCEPTED');
              }
            })
          } else if (!request.rejectedAt) {
            Request.accept(request).pipe(take(1)).subscribe(() => {
              router.navigate(['topics', request.topicId]);

              setTimeout(() => {
                NotificationService.addSuccess('MSG_REQUEST_ACCEPTED');
              })
            });
          } else {
            router.navigate(['groups', request.groupId]);
            NotificationService.addWarning('MSG_REQUEST_REJECTED_ALREADY');
          }
        } else if (curPath === 'reject') {
          if (request.rejectedAt) {
            router.navigate(['groups', request.groupId]);
            setTimeout(() => {
              if (new Date().getTime() - new Date(request.acceptedAt).getTime() > 10000) {
                NotificationService.addWarning('MSG_REQUEST_REJECTED_ALREADY');
              } else {
                NotificationService.addSuccess('MSG_REQUEST_REJECTED');
              }

            })
          } else if (!request.acceptedAt) {
            Request.reject(request).pipe(take(1)).subscribe(() => {
              router.navigate(['groups', request.groupId]);
              setTimeout(() => {
                NotificationService.addSuccess('MSG_REQUEST_REJECTED');
              })
            });
          } else {
            router.navigate(['topics', request.topicId]);
            NotificationService.addWarning('MSG_REQUEST_ACCEPTED_ALREADY');
          }
        }
      });
    })).subscribe();
  }
}
