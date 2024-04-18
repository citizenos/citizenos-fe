import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicService } from 'src/app/services/topic.service';
import { TopicIdeationService } from 'src/app/services/topic-ideation.service';
import { DialogService } from 'src/app/shared/dialog';
import { of, take, tap, map, BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TopicVoteReminderDialog } from 'src/app/topic/components/topic-vote-reminder-dialog/topic-vote-reminder-dialog.component';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { Idea } from 'src/app/interfaces/idea';


@Component({
  selector: 'topic-ideation',
  templateUrl: './topic-ideation.component.html',
  styleUrls: ['./topic-ideation.component.scss']
})
export class TopicIdeationComponent {
  @Input() ideation!: any;
  @Input() topic!: Topic;

  STATUSES = this.TopicService.STATUSES;
  VISIBILITY = this.TopicService.VISIBILITY;
  userHasVoted: boolean = false;
  editVote: boolean = false;
  wWidth: number = window.innerWidth;
  ideas$ = of(<Idea[]>[]);
  allIdeas$: Idea[] = [];
  tabSelected = 'ideas';
  ideaFilters = {
    type: '',
    orderBy: '',
    participants: ''
  };

  ideaTypeFilter$ = new BehaviorSubject('');
  orderFilter$ = new BehaviorSubject('');
  ideaParticipantsFilter$ = new BehaviorSubject('');
  ideaSearchFilter$ = new BehaviorSubject('');

  constructor(
    public app: AppService,
    private dialog: DialogService,
    private Notification: NotificationService,
    public AuthService: AuthService,
    public TopicService: TopicService,
    private TopicIdeationService: TopicIdeationService,
    private TopicIdeaService: TopicIdeaService
  ) { }

  ngOnInit(): void {
    this.TopicIdeaService.setParam('topicId', this.topic.id);
    this.TopicIdeaService.setParam('ideationId', this.topic.ideationId);
    this.ideas$ = combineLatest([this.ideaTypeFilter$, this.orderFilter$, this.ideaParticipantsFilter$, this.ideaSearchFilter$])
      .pipe(
        switchMap(([typeFilter, orderFilter, participantFilter, search]) => {
          this.allIdeas$ = [];
          if (typeFilter) {
            if (['favourite', 'showModerated'].indexOf(typeFilter) > -1) {
              this.TopicIdeaService.setParam(typeFilter, typeFilter);
            }
          }

          if (orderFilter) {
            this.TopicIdeaService.setParam('orderBy', orderFilter);
            this.TopicIdeaService.setParam('order', 'desc');
          }

          if (participantFilter) {
            this.TopicIdeaService.setParam('authorId', [participantFilter]);
          }

          if (search) {
            this.TopicIdeaService.setParam('search', search);
          }
          return this.TopicIdeaService.loadItems();
        }), map(
          (newideas: any) => {
            this.allIdeas$ = [];
            this.allIdeas$ = this.allIdeas$.concat(newideas);
            return this.allIdeas$;
          }
        ));
  }

  setType(type: string) {
    if (type === 'all' || typeof type !== 'string') type = '';
    this.ideaTypeFilter$.next(type);
    this.ideaFilters.type = type;
  }

  orderBy(orderBy: string) {
    if (orderBy === 'all' || typeof orderBy !== 'string') orderBy = '';
    this.orderFilter$.next(orderBy);
    this.ideaFilters.orderBy = orderBy;
  }

  selectTab(tab: string) {
    this.tabSelected = tab;
  }

  addIdea() {
    this.app.addIdea.next(!this.app.addIdea.value);
  }

  canUpdate() {
    return this.TopicService.canUpdate(this.topic);
  }

  canVote() {
    /*this.topic.ideation = this.ideation;
    return this.TopicVoteService.canVote(this.topic);*/
  }

  saveIdeation() {
    const saveIdeation: any = Object.assign(this.ideation, { topicId: this.topic.id });
    this.TopicIdeationService.update(saveIdeation)
      .pipe(take(1))
      .subscribe({
        next: (ideation) => {
          this.ideation = ideation;
          this.TopicService.reloadTopic();
          this.dialog.closeAll();
        },
        error: (res) => {
          console.debug('saveIdeation() ERR', res, res.errors);
          Object.values(res).forEach((message) => {
            if (typeof message === 'string')
              this.Notification.addError(message);
          });
        }
      });
  }
  closeIdeation() {
    const closeVoteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'warn',
        heading: 'COMPONENTS.CLOSE_VOTING_CONFIRM.HEADING',
        description: 'COMPONENTS.CLOSE_VOTING_CONFIRM.ARE_YOU_SURE',
        confirmBtn: 'COMPONENTS.CLOSE_VOTING_CONFIRM.CONFIRM_YES',
        closeBtn: 'COMPONENTS.CLOSE_VOTING_CONFIRM.CONFIRM_NO'
      }
    });
    closeVoteDialog.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.ideation.deadline = new Date();
          this.saveIdeation();
          this.topic.status = this.TopicService.STATUSES.followUp;
          this.TopicService.patch(this.topic).pipe(take(1)).subscribe({
            next: () => {
              this.TopicService.reloadTopic();
            }
          });
        }
      }
    });
  }


  editDeadline() {
    /*  const voteDeadlineDialog = this.dialog.open(TopicVoteDeadlineComponent, {
        data: {
          vote: this.vote,
          topic: this.topic
        }
      });*/
  }
  canEditDeadline() {
    return this.topic.status === this.TopicService.STATUSES.voting;
  }

  hasIdeationEndedExpired() {
    return false;
    //    return this.TopicVoteService.hasVoteEndedExpired(this.topic, this.vote);
  };

  hasIdeationEnded() {
    //  return this.TopicVoteService.hasVoteEnded(this.topic, this.vote);
  };

  triggerFinalDownload(type: string, includeCSV?: boolean) {
    /*  let url = ''
      if (this.vote.downloads?.bdocFinal || this.vote.downloads?.zipFinal) {
        if (type === 'zip') {
          url = this.vote.downloads.zipFinal;
        } else {
          url = this.vote.downloads.bdocFinal;
        }
        if (!url) return;
        if (includeCSV) {
          url += '&include[]=csv';
        }
        window.location.href = url;
        return;
      }
      const finalDownloadDialog = this.dialog.open(DownloadVoteResultsComponent);
      finalDownloadDialog.afterClosed().subscribe({
        next: (allow: any) => {
          if (allow === 'deadline') {
            this.editDeadline();
          } else if (allow === true) {
            this.topic.status = this.TopicService.STATUSES.followUp;
            this.TopicService.patch(this.topic).pipe(take(1)).subscribe({
              next: () => {
                this.TopicService.reloadTopic();
                this.TopicVoteService.loadVote({ topicId: this.topic.id, voteId: this.topic.voteId! })
                  .pipe(take(1))
                  .subscribe({
                    next: (vote) => {
                      if (type === 'zip') {
                        url = vote.downloads.zipFinal;
                      } else {
                        url = vote.downloads.bdocFinal;
                      }
                      if (!url) return;
                      if (includeCSV) {
                        url += '&include[]=csv';
                      }
                      window.location.href = url;
                    }
                  });
              }
            });
          }
        },
        error: (err) => {

        }
      })*/
  }
}
