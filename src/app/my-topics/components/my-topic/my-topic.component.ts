import { AuthService } from 'src/app/services/auth.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { TopicActivityService } from 'src/app/services/topic-activity.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { Observable, take, map, switchMap, BehaviorSubject, tap, of } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicMemberUserService } from 'src/app/services/topic-member-user.service';
import { TopicMemberGroupService } from 'src/app/services/topic-member-group.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TopicNotificationSettingsComponent } from 'src/app/topic/components/topic-notification-settings/topic-notification-settings.component';
import { AnyForUntypedForms } from '@angular/forms';
@Component({
  selector: 'my-topic',
  templateUrl: './my-topic.component.html',
  styleUrls: ['./my-topic.component.scss']
})
export class MyTopicComponent implements OnInit {
  topic$: Observable<Topic>;
  activities$ = of(<any[]>[])
  allActivities$ = <any[]>[];
  memberGroups$ = of(<any[]>[]);

  groupLevels = Object.keys(this.TopicService.LEVELS);
  generalInfo = true;
  activityFeed = false;
  groupList = false;
  groupListSearch = false;
  activities = false;
  app: any;
  wWidth = window.innerWidth;
  constructor(
    private AuthService: AuthService,
    public TopicService: TopicService,
    private Translate: TranslateService,
    public dialog: MatDialog,
    public TopicMemberUserService: TopicMemberUserService,
    public TopicMemberGroupService: TopicMemberGroupService,
    private route: ActivatedRoute,
    private router: Router,
    public TopicActivityService: TopicActivityService
  ) {

    this.topic$ = this.route.params.pipe(
      switchMap((params) => {
        TopicMemberUserService.setParam('topicId', params['topicId']);
        return this.TopicService.get(params['topicId']);
      })
    );
    this.memberGroups$ = this.route.params.pipe(
      switchMap((params) => {
        this.TopicMemberGroupService.params.topicId = params['topicId'];
        this.TopicMemberGroupService.setParam('topicId', params['topicId']);
        return this.TopicMemberGroupService.loadItems()
      }));

    this.activities$ = this.route.params.pipe(
      switchMap((params) => {
        this.TopicActivityService.setParam('topicId', params['topicId']);
        return this.TopicActivityService.loadItems()
      }),
      map(
        (newActivities: any) => {
          console.log('newActivities', newActivities)
          this.allActivities$ = this.allActivities$.concat(newActivities);
          return this.allActivities$;
        }
      ));
  }

  ngOnInit(): void {
  }

  goToTopicView(topic: Topic) {
    if (!topic) return;
    const language = this.Translate.currentLang;
    const status = topic.status;
    if (status === this.TopicService.STATUSES.inProgress) {
      this.router.navigate([language, 'topics', topic.id]);
    } else if (status === this.TopicService.STATUSES.voting) {
      this.router.navigate([language, 'topics', topic.id, 'votes', topic.voteId]);
    } else {
      this.router.navigate([language, 'topics', topic.id, 'followup']);
    }
  };

  doShowTopicNotificationSettings(topicId: string) {
    this.dialog.open(TopicNotificationSettingsComponent, { data: { topicId } });
  }

  doLeaveTopic(topic: Topic) {
    const leaveDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_TXT_ARE_YOU_SURE',
        points: ['MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_TXT_LEAVING_TOPIC_DESC'],
        confirmBtn: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.TOPIC_MEMBER_USER_LEAVE_CONFIRM_BTN_NO'
      }
    });
    leaveDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.TopicMemberUserService
          .delete({ id: this.AuthService.user.value.id, topicId: topic.id })
          .pipe(take(1))
          .subscribe(() => {
            /* this.$state.go('my/topics', null, { reload: true });*/
            this.router.navigate([this.Translate.currentLang, 'my', 'topics']);
          });
      }
    });
  };

  doDeleteTopic(topic: Topic) {
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_DELETE_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.TOPIC_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.TOPIC_DELETE_CONFIRM_TXT_TOPIC_DELETED', 'MODALS.TOPIC_DELETE_CONFIRM_TXT_DISCUSSION_DELETED', 'MODALS.TOPIC_DELETE_CONFIRM_TXT_TOPIC_REMOVED_FROM_GROUPS'],
        confirmBtn: 'MODALS.TOPIC_DELETE_CONFIRM_YES',
        closeBtn: 'MODALS.TOPIC_DELETE_CONFIRM_NO'
      }
    });
    deleteDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.TopicService
          .delete(topic)
          .pipe(take(1))
          .subscribe((res) => {
            this.router.navigate([this.Translate.currentLang, 'my', 'topics']);
          })
      }
    });
  };

  doToggleActivities() {
    this.TopicActivityService.reset();
    this.activityFeed = !this.activityFeed;
  };

  doToggleMemberGroupList() {
    this.TopicMemberGroupService.reset();
    this.groupList = !this.groupList;
    /*   this.toggleTabParam('group_list')
           .then(() => {
               if (!doShowList) {
                   this.doShowMemberGroupList();
                   this.checkIfInView('group_list');
               }
           });*/
  };

  loadMoreActivities(event: any) {
    if ((event.target.scrollTop + event.target.offsetHeight) >= event.target.scrollHeight) {
      this.TopicActivityService.loadMore()
    }
  }

  viewMemberUsers() {}
  viewMemberGroups() {
    this.groupList = true;
  }

  doUpdateMemberGroup(topic: Topic, topicMemberGroup: any, level: string) {
    if (topicMemberGroup.level !== level) {
      const oldLevel = topicMemberGroup.level;
      topicMemberGroup.level = level;
      topicMemberGroup.topicId = topic.id;
      /*   this.TopicMemberGroupService
             .update(topicMemberGroup)
             .then(() => {
                 this.TopicMemberGroupService.reload();
             },() => {
                 topicMemberGroup.level = oldLevel;
         });*/
    }
  };
  doDeleteMemberGroup(topicMemberGroup:AnyForUntypedForms) {
   /* this.ngDialog
      .openConfirm({
        template: '/views/modals/topic_member_group_delete_confirm.html',
        data: {
          group: topicMemberGroup
        }
      })
      .then(() => {
        topicMemberGroup.topicId = this.topic.id;
        this.TopicMemberGroup
          .delete(topicMemberGroup)
          .then(() => {
            this.TopicMemberGroupService.reload();
            this.TopicMemberUserService.reload();
            this.topic.members.groups.count = this.topic.members.groups.count - 1;
          });
      }, angular.noop);*/
  };
}
