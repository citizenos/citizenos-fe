import { trigger, state, style } from '@angular/animations';
import { Component, Inject, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap, take, Observable } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/group.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Group } from 'src/app/interfaces/group';
import { TranslateService } from '@ngx-translate/core';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { TopicParticipantsDialogComponent } from '../topic-participants/topic-participants.component';
import { InviteEditorsComponent } from '../invite-editors/invite-editors.component';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicInviteDialogComponent } from '../topic-invite/topic-invite.component';
import { countries } from 'src/app/services/country.service';
import { languages } from 'src/app/services/language.service';
@Component({
  selector: 'topic-form',
  templateUrl: './topic-form.component.html',
  styleUrls: ['./topic-form.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        minHeight: 'min-content',
        maxHeight: 'min-content',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        overflowY: 'hidden',
        transition: '0.2s ease-in-out max-height'
      }))
    ]),
    trigger('openSlide', [
      // ...
      state('open', style({
        minHeight: 'auto',
        'maxHeight': '400px',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        minHeight: '80px',
        'maxHeight': '80px',
        transition: '0.2s ease-in-out max-height'
      }))
    ])]
})
export class TopicFormComponent {
  @ViewChild('imageUpload') fileInput?: ElementRef;
  @Input() topic!: Topic;

  tabSelected;
  tabs = ['info', 'settings', 'preview'];

  tags = <string[]>[];

  block = {
    attachments: false,
    headerImage: false,
    title: false,
    intro: false,
    description: false
  }

  titleLimit = 100;
  introLimit = 500;

  tmpImageUrl?: string;
  imageFile?: any;

  VISIBILITY = this.TopicService.VISIBILITY;
  CATEGORIES = Object.keys(this.TopicService.CATEGORIES);
  groups$: Observable<Group[] | any[]> = of([]);
  topicGroups = <Group[]>[];

  readMore = false;

  showHelp = false;
  languages = languages;
  countries = countries;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private Notification: NotificationService,
    public TopicService: TopicService,
    public GroupService: GroupService,
    public GroupMemberTopicService: GroupMemberTopicService,
    public translate: TranslateService,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer
  ) {
    this.groups$ = this.GroupService.loadItems();
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('info')
        }
        return fragment
      }
      ));
  }

  selectTab(tab: string) {
    this.router.navigate([], { fragment: tab });
  }

  nextTab(tab: string | void) {
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > -1 && tabIndex < 3) {
        this.selectTab(this.tabs[tabIndex + 1]);
      }
    }
  }

  previousTab(tab: string | void) {
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > 0) {
        this.selectTab(this.tabs[tabIndex - 1]);
      }
    }
  }

  fileUpload() {
    const files = this.fileInput?.nativeElement.files;
    this.imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      return (e: any) => {
        this.tmpImageUrl = e.target.result;
      };
    })();
    reader.readAsDataURL(files[0]);
  }

  fileDroped(files: any) {
    this.imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      return (e: any) => {
        this.tmpImageUrl = e.target.result;
      };
    })();
    reader.readAsDataURL(files[0]);
  }
  uploadImage() {
    this.fileInput?.nativeElement.click();
  };

  deleteTopicImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }
    this.imageFile = null;
    this.tmpImageUrl = undefined;
  }

  topicDownload(topicId: string) {
    return this.TopicService.download(topicId);
  }

  deleteTopic(topicId: string) {
    /*this.TopicService.doDeleteTopic(topic, [this.Translate.currentLang, 'my', 'topics']);*/
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
        this.TopicService.delete({ id: topicId })
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate(['my', 'topics']);
          })
      }
    });
  };

  updateTopic() {
    return this.TopicService.patch(this.topic).pipe(take(1)).subscribe();
  }

  publish() {
    this.updateTopic();
    this.router.navigate(['/', this.translate.currentLang, 'topics', this.topic.id]);
    this.Notification.addSuccess('Congratulations on your new topic! Now it’s time to get peopple engaged. Invite participants below or you can also invite them later.', 'Topic successfully published');
    this.inviteMembers();
  }

  sanitizeURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.topic.padUrl);
  }

  chooseCategory(category: string) {
    if (this.topic.categories && this.topic.categories.indexOf(category) > -1) {
      this.topic.categories.splice(this.topic.categories.indexOf(category), 1);
    } else {
      this.topic.categories?.push(category);
    }
  }

  addGroup(group: Group) {
    this.topicGroups.push(group);
  }


  manageMembers() {
    const manageDialog = this.dialog.open(TopicParticipantsDialogComponent, { data: { topic: this.topic } });
    manageDialog.afterClosed().subscribe({
      next: (res) => {
        console.log('MANAGED', res);
      },
      error: (error) => {
        console.log('ERROR', error);
      }
    })
  }

  inviteEditors() {
    const inviteDialog = this.dialog.open(InviteEditorsComponent, { data: { topic: this.topic } });
    inviteDialog.afterClosed().subscribe({
      next: (inviteUsers) => {
        console.log(inviteUsers);
        this.topic.members.users = inviteUsers;
      },
      error: (error) => {
        // this.NotificationService.addError(error);
      }
    })
  }

  inviteMembers() {
    const inviteDialog = this.dialog.open(TopicInviteDialogComponent, { data: { topic: this.topic } });
    inviteDialog.afterClosed().subscribe({
      next: (inviteUsers) => {
        this.topic.members.users = inviteUsers;
        //   this.NotificationService.addSuccess('');
      },
      error: (error) => {
        // this.NotificationService.addError(error);
      }
    })
  }

  addTag(e: Event) {
    const tag = (e.target as HTMLInputElement).value;
    if (tag)
      this.tags.push(tag);
    (e.target as HTMLInputElement).value = '';
  }

  removeTag(tag: string) {
    this.tags.splice(this.tags.indexOf(tag), 1);
  }
}
