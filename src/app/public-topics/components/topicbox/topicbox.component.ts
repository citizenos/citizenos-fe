import { GroupMemberTopicService } from '@services/group-member-topic.service';
import { TopicIdeaService } from '@services/topic-idea.service';
import { TopicEventService } from '@services/topic-event.service';
import { Router } from '@angular/router';
import { TopicService } from '@services/topic.service';
import { TopicVoteService } from '@services/topic-vote.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Topic } from '@interfaces/topic';
import { Observable, map, of, take, tap } from 'rxjs';
import { Vote } from '@interfaces/vote';
import { DialogService } from '@shared/dialog';
import { TopicReportReasonComponent } from 'src/app/topic/components/topic-report-reason/topic-report-reason.component';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'topicbox',
  templateUrl: './topicbox.component.html',
  styleUrls: ['./topicbox.component.scss'],
  standalone: false
})

export class TopicboxComponent implements OnInit {
  @Input() topic = <Topic>{}; // decorate the property with @Input()
  @Input() remove?:boolean;
  @Input() groupId?:string;
  @Output() topicChanges = new EventEmitter<string>();

  catClass = "varia";
  vote$?: Observable<Vote>;
  milestones$?: Observable<{count: Number}> = of({count: 0});
  ideaCount$?: Observable<{count: Number}> = of({count: 0});
  vote?: Vote;
  constructor(
    private TopicService: TopicService,
    private TopicVoteService: TopicVoteService,
    private router: Router,
    private TopicEventService: TopicEventService,
    private DialogService: DialogService,
    private TopicIdeaService: TopicIdeaService,
    private GroupMemberTopicService: GroupMemberTopicService,
    private Translate: TranslateService) {
  }

  ngOnInit(): void {
    const catEntries = Object.keys(this.TopicService.CATEGORIES).filter((cat) => this.topic.categories?.indexOf(cat) > -1);
    if (catEntries.length) {
      this.catClass = catEntries[0];
    }
    if (this.topic.voteId || this.topic.vote) {
      this.vote$ = this.TopicVoteService.get({ topicId: this.topic.id, voteId: this.topic.voteId || this.topic.vote?.id }).pipe(
        tap((vote) => this.vote = vote)
      );
    }
    if (this.topic.status === this.TopicService.STATUSES.followUp) {
      this.milestones$ = this.TopicEventService.query({topicId: this.topic.id}).pipe(map((res) => {return {count: res.count}}));
    }
    if (this.topic.status === this.TopicService.STATUSES.ideation && this.topic.ideationId) {
      this.ideaCount$ = this.TopicIdeaService.query({topicId: this.topic.id, ideationId: this.topic.ideationId}).pipe(
        map((res) => {
          if( typeof res.data.count  === 'number') return {count: res.data.count};
          return {count: 0};
        })
      )
    }
  }

  showInfo() {
    return window.innerWidth > 667;
  }

  getTopicPath () {
    let urlArray = [this.Translate.currentLang, 'topics', this.topic.id];
    if (this.topic.status === this.TopicService.STATUSES.draft && this.TopicService.canDelete(this.topic)) {
      urlArray = ['topics', 'edit', this.topic.id];
      if (this.topic.voteId) {
        urlArray = ['topics', 'vote', 'edit', this.topic.id];
      }
      if (this.topic.ideationId) {
        urlArray = ['topics', 'ideation', 'edit', this.topic.id];
      }
    }
    let fragment = 'discussion';
    if (this.topic.status === this.TopicService.STATUSES.draft) {
      fragment = 'info';
    }
    if (this.topic.status === this.TopicService.STATUSES.ideation) {
      fragment = 'ideation';
    }
    if (this.topic.status === this.TopicService.STATUSES.voting) {
      fragment = 'voting';
    } else if (this.topic.status === this.TopicService.STATUSES.followUp) {
      fragment = 'followUp';
    }
    return {urlArray, fragment};
  }

  getTopicLink() {
    const navItems = this.getTopicPath();
    return this.router.createUrlTree(navItems.urlArray, {fragment: navItems.fragment});
  }

  goToView() {
    const navItems = this.getTopicPath();
    this.router.navigate(navItems.urlArray, { fragment: navItems.fragment });
  }

  getProgress() {
    switch (this.topic.status) {
      case 'inProgress':
        return 100;
      case 'voting':
        return Math.floor(((this.vote?.votersCount || 0) / this.topic.members.users.count) * 100);
      default:
        return 100;
    }
  }


  getDescription() {
    const element = document.createElement('html');
    element.innerHTML = this.topic.description;
    if (this.topic.title) {
      return element.innerHTML.replace(this.topic.title, '')
    }

    return element.innerHTML;
  }

  reportReasonDialog() {
    this.DialogService.open(TopicReportReasonComponent, {
      data: {
        report: {
          moderatedReasonText: this.topic.report?.moderatedReasonText || this.topic.report?.text,
          moderatedReasonType: this.topic.report?.moderatedReasonType || this.topic.report?.type,
        }
      }
    })
  }

  removeFromGroup ($event: any) {
    $event.stopPropagation();
    const confirmRemoveDialog = this.DialogService.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.GROUP_MEMBER_TOPIC_DELETE_CONFIRM_HEADING',
        description: 'MODALS.GROUP_MEMBER_TOPIC_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        confirmBtn: 'MODALS.GROUP_MEMBER_TOPIC_DELETE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_MEMBER_TOPIC_DELETE_CONFIRM_BTN_NO'
      }
    });

    confirmRemoveDialog.afterClosed().subscribe({
      next: (confirm) => {
        if (confirm && this.groupId) {
          this.GroupMemberTopicService.delete({topicId: this.topic.id, groupId: this.groupId}).pipe(
            take(1)
          ).subscribe({
            next: (res) => {
              this.topicChanges?.emit(this.topic.id);
            },
            error: (err) => {
              console.log(err);
            }
          })
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
