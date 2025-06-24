import { AuthService } from '@services/auth.service';
import { AppService } from '@services/app.service';
import { NotificationService } from '@services/notification.service';
import { TopicService } from '@services/topic.service';
import { TopicIdeationService } from '@services/topic-ideation.service';
import { DialogService } from '@shared/dialog';
import { of, take, map, BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TopicIdeaService } from '@services/topic-idea.service';
import { Component, Input, NgZone } from '@angular/core';
import { municipalities } from '@services/municipalitiy.service';

import { CreateIdeaFolderComponent } from '../create-idea-folder/create-idea-folder.component';
import { ActivatedRoute } from '@angular/router';
import { EditIdeationDeadlineComponent } from '../edit-ideation-deadline/edit-ideation-deadline.component';
import { AddIdeasToFolderComponent } from '../add-ideas-to-folder/add-ideas-to-folder.component';
import { EditIdeaFolderComponent } from '../edit-idea-folder/edit-idea-folder.component';
import { TranslateService } from '@ngx-translate/core';
import { TopicIdeationFoldersService } from '@services/topic-ideation-folders.service';

import { Topic } from '@interfaces/topic';
import { Idea, IdeaStatus } from '@interfaces/idea';
import { Folder } from '@interfaces/folder';
import { User } from '@interfaces/user';
import { Notification } from '@interfaces/notification';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'topic-ideation',
  templateUrl: './topic-ideation.component.html',
  styleUrls: ['./topic-ideation.component.scss'],
})
export class TopicIdeationComponent {
  @Input() ideation!: any;
  @Input() topic!: Topic;

  AGE_LIMIT = 110;
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
  ideasCount$ = of (0);
  folders$ = of(<Folder[]>[]);
  folders = <Folder[]>[];
  allIdeas$: Idea[] = [];
  tabSelected = 'ideas';
  ideaFilters = {
    age: <string[]>[],
    gender: '',
    residence: '',
    type: '',
    orderBy: '',
    participants: <User | any>'',
    search: '',
  };

  mobileIdeaFiltersList = false;

  mobileIdeaFilters: any = {
    age: '',
    gender: '',
    residence: '',
    type: '',
    orderBy: '',
    participants: <User | any>'',
  };

  mobileAges = <string[]>[];

  municipalities = municipalities;

  ideaSearchFilter$ = new BehaviorSubject('');
  ideaTypeFilter$ = new BehaviorSubject('');
  ageFilter$ = new BehaviorSubject<(number | string)[]>([]);
  genderFilter$ = new BehaviorSubject('');
  residenceFilter$ = new BehaviorSubject('');
  orderFilter$ = new BehaviorSubject('');
  ideaParticipantsFilter$ = new BehaviorSubject(<User | string>'');
  searchIdeasInput = '';
  folderFilter$ = new BehaviorSubject('');
  loadFolders$ = new BehaviorSubject<void>(undefined);
  selectedFolder?: Folder;
  notification: Notification | null = null;
  showSearch = false;

  constructor(
    public readonly app: AppService,
    private readonly dialog: DialogService,
    private readonly Notification: NotificationService,
    public readonly AuthService: AuthService,
    private readonly route: ActivatedRoute,
    public readonly translate: TranslateService,
    public readonly TopicService: TopicService,
    private readonly TopicIdeationService: TopicIdeationService,
    private readonly TopicIdeationFoldersService: TopicIdeationFoldersService,
    public readonly TopicIdeaService: TopicIdeaService,
    public readonly Location: LocationService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.ideasCount$ = this.TopicIdeaService.countTotal$;
    this.ideas$ = combineLatest([
      this.ideaTypeFilter$,
      this.orderFilter$,
      this.ideaParticipantsFilter$,
      this.folderFilter$,
      this.TopicIdeaService.reload$,
      this.ageFilter$,
      this.genderFilter$,
      this.residenceFilter$,
      this.ideaSearchFilter$,
    ]).pipe(
      switchMap(
        ([
          typeFilter,
          orderFilter,
          participantFilter,
          folderFilter,
          load,
          age,
          gender,
          residence,
          search,
        ]) => {
          this.TopicIdeaService.reset();
          this.TopicIdeaService.setParam('topicId', this.topic.id);
          this.TopicIdeaService.setParam('ideationId', this.topic.ideationId);
          this.TopicIdeaService.setParam('offset', 0);
          this.TopicIdeaService.setParam('limit', 15);
          this.allIdeas$ = [];
          if (typeFilter) {
            if (['favourite', 'showModerated'].indexOf(typeFilter) > -1) {
              this.TopicIdeaService.setParam(typeFilter, typeFilter);
            } else if (typeFilter === 'iCreated') {
              this.TopicIdeaService.setParam(
                'authorId',
                this.AuthService.user.value.id
              );
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
            console.log('search', search);
            this.TopicIdeaService.setParam('search', search);
          }

          if (age || gender || residence) {
            this.TopicIdeaService.setParam(
              'demographics',
              JSON.stringify({
                ...(age &&
                  Array.isArray(age) &&
                  age.length && { age: age.map(String) }),
                ...(gender && { gender }),
                ...(residence && { residence }),
              })
            );
          }

          if (
            typeFilter ||
            orderFilter ||
            participantFilter ||
            folderFilter ||
            search ||
            age?.length > 0 ||
            gender ||
            residence
          ) {
            this.filtersSet = true;
          } else {
            this.filtersSet = false;
          }

          return this.TopicIdeaService.loadItems();
        }
      ),
      map((newideas: Idea[]) => {
        this.allIdeas$ = [];
        this.allIdeas$ = this.allIdeas$.concat(newideas).sort((a) => {
          return a.status === IdeaStatus.draft ? -1 : 1;
        });
        return this.allIdeas$;
      })
    );
    this.TopicIdeationService.setParam('topicId', this.topic.id);
    this.TopicIdeationService.setParam('ideationId', this.ideation.id);
    this.folders$ = this.loadFolders$.pipe(
      switchMap(() => {
        return this.TopicIdeationFoldersService.query({
          topicId: this.topic.id,
          ideationId: this.ideation.id,
        });
      }),
      map((res) => {
        this.ideation.folders.count = res.count;
        return res.rows;
      })
    );
    this.participants$ = this.TopicIdeationService.participants({
      topicId: this.topic.id,
      ideationId: this.ideation.id,
    }).pipe(
      map((res) => {
        this.users = res.rows;
        this.participantsCount = res.count;
        return res.rows;
      })
    );

    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      if (params['folderId']) {
        this.TopicIdeaService.getFolder({
          topicId: this.topic.id,
          ideationId: this.ideation.id,
          folderId: params['folderId'],
        })
          .pipe(take(1))
          .subscribe((folder: Folder) => {
            console.log(folder);
            this.tabSelected = 'folders';
            if (folder) this.viewFolder(folder);
            console.log('folders', params);
          });
      }
    });
  }

  get isCountryEstonia() {
    return this.topic.country === 'Estonia';
  }

  get hasDemograficsField() {
    return {
      age: this.ideation.demographicsConfig?.age,
      gender: this.ideation.demographicsConfig?.gender,
      residence: this.ideation.demographicsConfig?.residence,
    };
  }

  get sortedSelectedAges() {
    return this.ideaFilters.age
      .sort((a, b) => {
        const ageA = parseInt(a, 10);
        const ageB = parseInt(b, 10);
        return ageA - ageB;
      })
      .join(', ');
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  setSearch(value: string) {
    this.ideaSearchFilter$.next(value);
    this.ideaFilters.search = value;
  }

  setType(type: string) {
    if (type === 'all' || typeof type !== 'string') type = '';
    this.ideaTypeFilter$.next(type);
    this.ideaFilters.type = type;
  }

  setAge(_age: number | string, withRequest = true) {
    const age = _age.toString();
    if (age === 'all' || age === '') {
      if (withRequest) {
        this.ageFilter$.next([]);
      }
      this.ideaFilters.age = [];
      return;
    }

    const idx = this.ideaFilters.age.indexOf(age);
    if (idx > -1) {
      this.ideaFilters.age.splice(idx, 1);
    } else {
      this.ideaFilters.age.push(age);
    }
    if (withRequest) {
      this.ageFilter$.next([...this.ideaFilters.age]);
    }
  }

  setMobileAges(_age: number | string) {
    const age = _age.toString();
    if (age === 'all' || age === '') {
      this.mobileAges = [];
      return;
    }

    const idx = this.mobileAges.indexOf(age);
    if (idx > -1) {
      this.mobileAges.splice(idx, 1);
    } else {
      this.mobileAges.push(age);
    }
  }

  applyAgeFilter() {
    this.ageFilter$.next([...this.mobileAges]);
    this.ideaFilters.age = [...this.mobileAges];
  }

  setGender(value: string) {
    if (value === 'all') value = '';
    this.genderFilter$.next(value);
    this.ideaFilters.gender = value;
  }

  setResidence(value: string) {
    if (value === 'all') value = '';
    this.residenceFilter$.next(value);
    this.ideaFilters.residence = value;
  }

  userIndex() {
    let userIndex = this.users.findIndex(
      (user) => user.id === this.ideaFilters.participants?.id
    );
    return userIndex + 1;
  }

  nextParticipant() {
    if (typeof this.ideaFilters.participants === 'object') {
      let userIndex = this.users.findIndex(
        (user) => user.id === this.ideaFilters.participants?.id
      );
      if (userIndex === this.users.length - 1) userIndex = -1;
      const user = this.users[userIndex + 1];
      console.log(userIndex, user);
      this.setParticipant(user);
    }
  }
  prevParticipant() {
    if (typeof this.ideaFilters.participants === 'object') {
      let userIndex = this.users.findIndex(
        (user) => user.id === this.ideaFilters.participants.id
      );
      if (userIndex === 0) userIndex = this.users.length;
      const user = this.users[userIndex - 1];
      console.log(userIndex, user);
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
      const redirectSuccess =
        this.Location.getAbsoluteUrl(window.location.pathname) +
        window.location.search;
      this.app.doShowLogin(redirectSuccess);
    }
  }

  canUpdate() {
    return this.TopicService.canUpdate(this.topic);
  }

  doClearFilters() {
    this.setType('');
    this.orderBy('');
    this.setAge('');
    this.setGender('');
    this.setResidence('');
    this.setParticipant();
    this.filtersSet = false;
    this.mobileAges = [];
  }

  saveIdeation() {
    const saveIdeation: any = Object.assign({
      topicId: this.topic.id,
      ideationId: this.ideation.id,
      deadline: this.ideation.deadline,
    });
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
        },
      });
  }

  exportIdeas() {
    const downloadUrl = this.TopicIdeationService.downloadIdeas(
      this.topic.id,
      this.ideation.id
    );
    window.open(downloadUrl);
    /* const closeIdeationDialog = this.dialog.open(ConfirmDialogComponent, {
       data: {
         level: 'info',
         heading: 'COMPONENTS.EXPORT_IDEAS_CONFIRM.HEADING',
         description: 'COMPONENTS.EXPORT_IDEAS_CONFIRM.DESCRIPTION',
         confirmBtn: 'COMPONENTS.EXPORT_IDEAS_CONFIRM.CONFIRM_YES',
         closeBtn: 'COMPONENTS.EXPORT_IDEAS_CONFIRM.CONFIRM_NO'
       }
     });
     closeIdeationDialog.afterClosed().subscribe({
       next: (value) => {
         if (value) {
           const downloadUrl = this.TopicIdeationService.downloadIdeas(this.topic.id, this.ideation.id);
           window.open(downloadUrl);
         }
       }
     });*/
  }
  closeIdeation() {
    const closeIdeationDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'warn',
        heading: 'COMPONENTS.CLOSE_IDEATION_CONFIRM.HEADING',
        description: 'COMPONENTS.CLOSE_IDEATION_CONFIRM.ARE_YOU_SURE',
        sections: [
          {
            heading: '',
            points: ['COMPONENTS.CLOSE_IDEATION_CONFIRM.CANNOT_UNDO'],
          },
        ],
        confirmBtn: 'COMPONENTS.CLOSE_IDEATION_CONFIRM.CONFIRM_YES',
        closeBtn: 'COMPONENTS.CLOSE_IDEATION_CONFIRM.CONFIRM_NO',
      },
    });
    closeIdeationDialog.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.ideation.deadline = new Date();
          this.saveIdeation();
          this.TopicService.reloadTopic();
        }
      },
    });
  }
  addIdeasToFolder(folder: Folder) {
    const folderCreateDialog = this.dialog.open(AddIdeasToFolderComponent, {
      data: {
        folder: folder,
        topicId: this.topic.id,
        ideationId: this.ideation.id,
      },
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
        folder: folder,
      },
    });

    folderCreateDialog.afterClosed().subscribe(() => {
      this.loadFolders$.next();
    });
  }
  deleteFolder(folder: Folder) {
    this.TopicIdeationFoldersService.delete({
      topicId: this.topic.id,
      ideationId: this.ideation.id,
      folderId: folder.id,
    })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadFolders$.next();
        },
        error: () => {},
      });
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
    const ideationDeadlineDialog = this.dialog.open(
      EditIdeationDeadlineComponent,
      {
        data: {
          ideation: this.ideation,
          topic: this.topic,
        },
      }
    );
    ideationDeadlineDialog.afterClosed().subscribe(() => {
      this.TopicIdeationService.reload();
    });
  }

  canEdit() {
    return this.TopicService.canEdit(this.topic);
  }
  canEditDeadline() {
    return (
      this.canEdit() &&
      this.topic.status === this.TopicService.STATUSES.ideation
    );
  }

  hasIdeationEndedExpired() {
    return this.TopicIdeationService.hasIdeationEndedExpired(
      this.topic,
      this.ideation
    );
  }

  hasIdeationEnded() {
    return this.TopicIdeationService.hasIdeationEnded(
      this.topic,
      this.ideation
    );
  }

  createFolder() {
    const folderCreateDialog = this.dialog.open(CreateIdeaFolderComponent, {
      data: {
        topicId: this.topic.id,
        ideationId: this.ideation.id,
      },
    });

    folderCreateDialog.afterClosed().subscribe(() => {
      this.loadFolders$.next();
      this.TopicIdeaService.page$.next(1);
    });
  }

  closeMobileFilter() {
    const filtersShow = Object.entries(this.mobileIdeaFilters).find(
      ([key, value]) => {
        return !!value;
      }
    );
    if (filtersShow) this.mobileIdeaFilters[filtersShow[0]] = false;
  }

  showMobileOverlay() {
    const filtersShow = Object.entries(this.mobileIdeaFilters).find(
      ([key, value]) => {
        return !!value;
      }
    );

    if (filtersShow) return true;

    return false;
  }
}
