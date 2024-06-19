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
import { Folder } from 'src/app/interfaces/folder';
import { CreateIdeaFolderComponent } from '../create-idea-folder/create-idea-folder.component';
import { Router } from '@angular/router';
import { EditIdeationDeadlineComponent } from '../edit-ideation-deadline/edit-ideation-deadline.component';
import { AddIdeasToFolderComponent } from '../add-ideas-to-folder/add-ideas-to-folder.component';
import { User } from 'src/app/interfaces/user';
import { EditIdeaFolderComponent } from '../edit-idea-folder/edit-idea-folder.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'topic-ideation',
  templateUrl: './topic-ideation.component.html',
  styleUrls: ['./topic-ideation.component.scss']
})
export class TopicIdeationComponent {
  @Input() ideation!: any;
  @Input() topic!: Topic;

  public FILTERS_ALL = 'all';
  STATUSES = this.TopicService.STATUSES;
  VISIBILITY = this.TopicService.VISIBILITY;
  userHasVoted: boolean = false;
  editVote: boolean = false;
  filtersSet: boolean = false;

  wWidth: number = window.innerWidth;
  participants$ = of(<User[]>[]);
  users = <User[]>[];
  participantsCount = 0;
  ideas$ = of(<Idea[]>[]);
  folders$ = of(<Folder[]>[]);
  allIdeas$: Idea[] = [];
  tabSelected = 'ideas';
  ideaFilters = {
    type: '',
    orderBy: '',
    participants: <User | any>''
  };

  mobileIdeaFiltersList = false;

  mobileIdeaFilters: any = {
    type: '',
    orderBy: '',
    participants: <User | any>''
  }

  ideaTypeFilter$ = new BehaviorSubject('');
  orderFilter$ = new BehaviorSubject('');
  ideaParticipantsFilter$ = new BehaviorSubject(<User | string>'');
  searchIdeasInput = '';
  ideaSearchFilter$ = new BehaviorSubject('');
  folderFilter$ = new BehaviorSubject('');
  loadFolders$ = new BehaviorSubject<void>(undefined);
  selectedFolder?: Folder;
  notification: any = null;
  constructor(
    public app: AppService,
    private dialog: DialogService,
    private Notification: NotificationService,
    public AuthService: AuthService,
    private router: Router,
    public translate: TranslateService,
    public TopicService: TopicService,
    private TopicIdeationService: TopicIdeationService,
    public TopicIdeaService: TopicIdeaService
  ) { }

  ngOnInit(): void {

    this.ideas$ = combineLatest([this.ideaTypeFilter$, this.orderFilter$, this.ideaParticipantsFilter$, this.folderFilter$, this.ideaSearchFilter$, this.TopicIdeaService.loadIdeas$])
      .pipe(
        switchMap(([typeFilter, orderFilter, participantFilter, folderFilter, search, load]) => {
          this.TopicIdeaService.setParam('topicId', this.topic.id);
          this.TopicIdeaService.reset();
          this.TopicIdeaService.setParam('topicId', this.topic.id);
          this.TopicIdeaService.setParam('ideationId', this.topic.ideationId);
          this.allIdeas$ = [];
          if (typeFilter) {
            if (['favourite', 'showModerated'].indexOf(typeFilter) > -1) {
              this.TopicIdeaService.setParam(typeFilter, typeFilter);
            } else if (typeFilter === 'iCreated') {
              this.TopicIdeaService.setParam('authorId', this.AuthService.user.value.id);
            }
          }

          if (orderFilter) {
            this.TopicIdeaService.setParam('orderBy', orderFilter);
            this.TopicIdeaService.setParam('order', 'desc');
          }

          if (participantFilter && typeof participantFilter === 'object') {
            this.TopicIdeaService.setParam('authorId', [participantFilter.id]);
          }
          if (folderFilter) {
            this.TopicIdeaService.setParam('folderId', folderFilter);
          }
          if (search) {
            this.TopicIdeaService.setParam('search', search);
          }

          if (typeFilter || orderFilter || participantFilter || folderFilter || search) {
            this.filtersSet = true;
          } else {
            this.filtersSet = false;
          }

          return this.TopicIdeaService.loadItems();
        }), map(
          (newideas: any) => {
            this.allIdeas$ = [];
            this.allIdeas$ = this.allIdeas$.concat(newideas);
            return this.allIdeas$;
          }
        ));
    this.TopicIdeationService.setParam('topicId', this.topic.id);
    this.TopicIdeationService.setParam('ideationId', this.ideation.id);
    this.folders$ = this.loadFolders$.pipe(
      switchMap(() => {
        return this.TopicIdeationService.getFolders({ topicId: this.topic.id, ideationId: this.ideation.id })
      }),
      map((res) => {
        this.ideation.folders.count = res.count;
        return res.rows;
      })
    );
    this.participants$ = this.TopicIdeationService.participants({ topicId: this.topic.id, ideationId: this.ideation.id }).pipe(
      map((res) => {
        this.users = res.rows;
        this.participantsCount = res.count;
        return res.rows;
      })
    );
  }

  setType(type: string) {
    if (type === 'all' || typeof type !== 'string') type = '';
    this.ideaTypeFilter$.next(type);
    this.ideaFilters.type = type;
  }

  userIndex() {
    let userIndex = this.users.findIndex((user) => user.id === this.ideaFilters.participants?.id)
    return userIndex + 1;
  }

  nextParticipant() {
    if (typeof this.ideaFilters.participants === 'object') {
      let userIndex = this.users.findIndex((user) => user.id === this.ideaFilters.participants?.id)
      if (userIndex === this.users.length - 1) userIndex = -1;
      const user = this.users[userIndex + 1];
      console.log(userIndex, user)
      this.setParticipant(user);
    }
  }
  prevParticipant() {
    if (typeof this.ideaFilters.participants === 'object') {
      let userIndex = this.users.findIndex((user) => user.id === this.ideaFilters.participants.id)
      if (userIndex === 0) userIndex = this.users.length;
      const user = this.users[userIndex - 1];
      console.log(userIndex, user)
      this.setParticipant(user);
    }
  }
  setParticipant(user?: User) {
    this.ideaParticipantsFilter$.next(user || '');
    this.ideaFilters.participants = user || '';
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
    if (this.AuthService.loggedIn$.value) {
      console.log('addIdea');
      this.app.addIdea.next(true);
    } else {
      this.app.doShowLogin();
    }
  }

  canUpdate() {
    return this.TopicService.canUpdate(this.topic);
  }

  doClearFilters() {
    this.setType('');
    this.orderBy('');
    this.filtersSet = false;
  }

  saveIdeation() {
    const saveIdeation: any = Object.assign({ topicId: this.topic.id, ideationId: this.ideation.id, deadline: this.ideation.deadline });
    this.TopicIdeationService.update(saveIdeation)
      .pipe(take(1))
      .subscribe({
        next: (ideation) => {
          this.ideation = ideation;
          this.TopicService.reloadTopic();
          this.dialog.closeAll();
        },
        error: (res) => {
          Object.values(res).forEach((message) => {
            if (typeof message === 'string')
              this.Notification.addError(message);
          });
        }
      });
  }
  closeIdeation() {
    const closeIdeationDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'warn',
        heading: 'COMPONENTS.CLOSE_IDEATION_CONFIRM.HEADING',
        description: 'COMPONENTS.CLOSE_IDEATION_CONFIRM.ARE_YOU_SURE',
        confirmBtn: 'COMPONENTS.CLOSE_IDEATION_CONFIRM.CONFIRM_YES',
        closeBtn: 'COMPONENTS.CLOSE_IDEATION_CONFIRM.CONFIRM_NO'
      }
    });
    closeIdeationDialog.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.ideation.deadline = new Date();
          this.saveIdeation();
          this.topic.status = this.TopicService.STATUSES.inProgress;
          this.TopicService.patch(this.topic).pipe(take(1)).subscribe({
            next: () => {
              this.TopicService.reloadTopic();
            }
          });
        }
      }
    });
  }
  addIdeasToFolder(folder: Folder) {
    const folderCreateDialog = this.dialog.open(AddIdeasToFolderComponent, {
      data: {
        folder: folder,
        topicId: this.topic.id,
        ideationId: this.ideation.id
      }
    });

    folderCreateDialog.afterClosed().subscribe(() => {
      this.loadFolders$.next();
    });
  }

  editFolder(folder: Folder) {
    const folderCreateDialog = this.dialog.open(EditIdeaFolderComponent, {
      data: {
        topicId: this.topic.id,
        ideationId: this.ideation.id,
        folder: folder
      }
    });

    folderCreateDialog.afterClosed().subscribe(() => {
      this.loadFolders$.next();
    });
  }
  deleteFolder(folder: Folder) {
    this.TopicIdeationService.deleteFolder({ topicId: this.topic.id, ideationId: this.ideation.id, folderId: folder.id }).pipe(take(1))
      .subscribe({
        next: () => {
          this.loadFolders$.next();
        },
        error: () => {

        }
      })
  }
  viewFolder(folder: Folder) {
    this.tabSelected = 'folder';
    this.selectedFolder = folder;
    this.folderFilter$.next(folder.id);
  }

  leaveFolder() {
    this.selectedFolder = undefined;
    this.tabSelected = 'folders';
    this.folderFilter$.next('');
  }

  editDeadline() {
    const ideationDeadlineDialog = this.dialog.open(EditIdeationDeadlineComponent, {
      data: {
        ideation: this.ideation,
        topic: this.topic
      }
    });
    ideationDeadlineDialog.afterClosed().subscribe(() => {
      this.TopicIdeationService.reloadIdeation();
    })
  }

  canEdit() {
    return this.TopicService.canEdit(this.topic);
  }
  canEditDeadline() {
    return this.canEdit() && this.topic.status === this.TopicService.STATUSES.ideation;
  }

  hasIdeationEndedExpired() {
    return this.TopicIdeationService.hasIdeationEndedExpired(this.topic, this.ideation);
  };

  hasIdeationEnded() {
    return this.TopicIdeationService.hasIdeationEnded(this.topic, this.ideation);
  };

  createFolder() {
    const folderCreateDialog = this.dialog.open(CreateIdeaFolderComponent, {
      data: {
        topicId: this.topic.id,
        ideationId: this.ideation.id
      }
    });

    folderCreateDialog.afterClosed().subscribe(() => {
      this.loadFolders$.next();
    });
  };

  searchIdeas(search: string) {
    this.ideaSearchFilter$.next(search);
  }

  closeMobileFilter() {
    const filtersShow = Object.entries(this.mobileIdeaFilters).find(([key, value]) => {
      return !!value;
    })
    if (filtersShow)
      this.mobileIdeaFilters[filtersShow[0]] = false;
  }

  showMobileOverlay() {
    const filtersShow = Object.entries(this.mobileIdeaFilters).find(([key, value]) => {
      return !!value;
    });

    if (filtersShow) return true;

    return false;
  }

}
