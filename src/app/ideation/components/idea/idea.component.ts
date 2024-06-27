import { TopicIdeaRepliesService } from './../../../services/topic-idea-replies.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { Component, ContentChildren, QueryList, ViewChildren, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DIALOG_DATA, DialogService } from 'src/app/shared/dialog';
import { take, combineLatest, Observable, switchMap, map, of, tap } from 'rxjs';
import { Idea } from 'src/app/interfaces/idea';
import { AuthService } from 'src/app/services/auth.service';
import { IdeaboxComponent } from '../ideabox/ideabox.component';
import { ConfigService } from 'src/app/services/config.service';
import { LocationService } from 'src/app/services/location.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Argument } from 'src/app/interfaces/argument';
import { TopicService } from 'src/app/services/topic.service';
import { Folder } from 'src/app/interfaces/folder';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safe-html.pipe';
import { IdeaReplyComponent } from '../idea-reply/idea-reply.component';

@Component({
  selector: 'app-idea',
  template: ''
})
export class IdeaComponent {
  ideaId: string = '';
  topicId: string = '';
  ideationId: string = '';
  constructor(dialog: DialogService, route: ActivatedRoute, TopicIdeaService: TopicIdeaService, router: Router, TopicService: TopicService) {
    route.params.pipe(take(1), switchMap((params) => {
      this.ideaId = params['ideaId'];
      this.topicId = params['topicId'];
      this.ideationId = params['ideationId'];
      return TopicIdeaService.query(params)
    })).subscribe((items) => {
      const idea = items.data.rows.find((idea: Idea) => idea.id === this.ideaId);
      TopicService.get(this.topicId).pipe(take(1)).subscribe((topic) => {
        dialog.closeAll();
        const ideaDialog = dialog.open(IdeaDialogComponent, {
          data: {
            idea,
            topic,
            ideation: { id: this.ideationId },
            route: route
          }
        });

        ideaDialog.afterClosed().subscribe((value) => {
          if (value) {
            TopicIdeaService.reloadIdeas();
            router.navigate(['/', 'topics', this.topicId], { fragment: 'ideation' })
          }
        });
      })
    });
  }
}

@Component({
  selector: 'app-idea',
  templateUrl: './idea-dialog.component.html',
  styleUrls: ['./idea-dialog.component.scss']
})
export class IdeaDialogComponent extends IdeaboxComponent {
  @ContentChildren(IdeaReplyComponent) ideaReplies!: QueryList<any>;
  data: any = inject(DIALOG_DATA);
  route;
  TopicIdeaRepliesService = inject(TopicIdeaRepliesService);
  DomSanitizer = inject(DomSanitizer);
  replies$: Observable<any>;
  argument = <Argument>{};
  notification: any;
  replyCount = 0;
  folders$: Observable<Folder[]>;
  constructor(
    dialog: DialogService,
    config: ConfigService,
    router: Router,
    Auth: AuthService,
    Location: LocationService,
    Notification: NotificationService,
    Translate: TranslateService,
    TopicService: TopicService,
    TopicIdeaService: TopicIdeaService
  ) {
    super(dialog, config, router, Auth, Location, Notification, Translate, TopicService, TopicIdeaService);
    this.idea = this.data.idea;
    this.topic = this.data.topic;
    this.ideation = this.data.ideation;
    this.route = this.data.route;
    const url = this.router.parseUrl(this.router.url);
    this.replies$ = combineLatest([this.route.params, this.TopicIdeaRepliesService.loadReplies$]).pipe(
      switchMap(([params]) => {
        return this.TopicIdeaRepliesService.getArguments(params);
      }),
      map((res: any) => {
        let results = res.rows.concat([]);
        const argArray = <any[]>[];
        let children = <any>{};

        const countTree = (parentNode: any, currentNode: any) => {
          argArray.push(currentNode);
          if (currentNode.replies.rows.length > 0) {
            currentNode.replies.rows.forEach((reply: any) => {
              countTree(parentNode, reply);
              const replyClone = Object.assign({}, reply);
              replyClone.replies = [];
              if (!parentNode.children) parentNode.children = [];
              parentNode.children.push(replyClone);
            });
          }
          // To have parent comment/reply data
          const parent = argArray.find((arg) => arg.id === currentNode.parent.id);
          currentNode.parent = Object.assign(currentNode.parent, parent);
        };

        results.forEach((row: any,) => {
          countTree(row, row);
          if (row.id === row.parent.id)
            row.parent = this.idea;
        });

        this.replyCount = results.length;
        return results;
      }),
      tap((replies) => {
        setTimeout(() => {
          console.log(this.route.queryParams.value['replyId'])
          if (this.route.queryParams.value['replyId']) {
            this.showReplies = true;
            this.goToArgument(this.route.queryParams.value['replyId'], replies);
          }
        }, 1000);
      }));
    this.folders$ = this.TopicIdeaService
      .getFolders({ topicId: this.topic.id, ideationId: this.idea.ideationId, ideaId: this.idea.id })
      .pipe(map((res: any) => res.rows));
  }

  prevIdea(ideas: Idea[]) {
    let index = ideas.findIndex((item) => item.id === this.idea.id);
    if (index === 0) index = ideas.length;
    const newIdea = ideas[index - 1];
    this.router.navigate(['/', this.Translate.currentLang, 'topics', this.topic.id, 'ideation', this.ideation.id, 'ideas', newIdea.id]);
    this.idea = newIdea;
    this.folders$ = this.TopicIdeaService
      .getFolders({ topicId: this.topic.id, ideationId: this.idea.ideationId, ideaId: this.idea.id })
      .pipe(map((res: any) => res.rows));
    this.notification = null;
  }

  nextIdea(ideas: Idea[]) {
    let index = ideas.findIndex((item) => item.id === this.idea.id);
    if (index === ideas.length - 1) index = -1;
    const newIdea = ideas[index + 1];
    this.router.navigate(['/', this.Translate.currentLang, 'topics', this.topic.id, 'ideation', this.ideation.id, 'ideas', newIdea.id]);
    this.idea = newIdea;
    this.folders$ = this.TopicIdeaService
      .getFolders({ topicId: this.topic.id, ideationId: this.idea.ideationId, ideaId: this.idea.id })
      .pipe(map((res: any) => res.rows));
    this.notification = null;
  }

  private _parseArgumentIdAndVersion(argumentIdWithVersion: string) {
    if (!argumentIdWithVersion) {
      return {
        commentId: null,
        commentVersion: null
      }
    }
    if (argumentIdWithVersion.length === 36) {
      argumentIdWithVersion = argumentIdWithVersion + this.TopicIdeaRepliesService.ARGUMENT_VERSION_SEPARATOR + '0';
    }
    const argumentIdAndVersionRegex = new RegExp('^([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12})' + this.TopicIdeaRepliesService.ARGUMENT_VERSION_SEPARATOR + '([0-9]+)$'); // SRC: https://gist.github.com/bugventure/f71337e3927c34132b9a#gistcomment-2238943
    const argumentIdWithVersionSplit = argumentIdWithVersion.match(argumentIdAndVersionRegex);

    if (!argumentIdWithVersionSplit) {
      console.error('Invalid input for _parseCommentIdAndVersion. Provided commentId does not look like UUIDv4 with version appended', argumentIdWithVersion);
      return {
        commentId: null,
        commentVersion: null
      }
    }

    return {
      argumentIdWithVersion,
      id: argumentIdWithVersionSplit[1],
      version: parseInt(argumentIdWithVersionSplit[2]),
    }
  };

  private scrollTo(argumentEl: HTMLElement | null) {
    if (argumentEl) {
      argumentEl.scrollIntoView();
      argumentEl.classList.add('highlight');
      setTimeout(() => {
        argumentEl?.classList.remove('highlight');
      }, 2000);
    }
  }
  goToArgument(argumentIdWithVersion: string, items: any) {
    if (!argumentIdWithVersion || argumentIdWithVersion.indexOf(this.TopicIdeaRepliesService.ARGUMENT_VERSION_SEPARATOR) < 0) {
      console.error('Invalid input for this.goToComment. Expecting UUIDv4 comment ID with version. For example: "604670eb-27b4-48d0-b19b-b6cf6bde33b2_v0"', argumentIdWithVersion);
      return;
    }
    let commentElement: HTMLElement | null = document.getElementById(argumentIdWithVersion);
    // The referenced comment was found on the page displayed
    if (commentElement) {
      this.scrollTo(commentElement);
      commentElement.classList.add('highlight');
      setTimeout(() => {
        if (commentElement)
          commentElement.classList.remove('highlight');
      }, 2000);
    } else {
      // The referenced comment was NOT found on the page displayed.
      // That means either:
      // 1. the commentId + version refers to another version of the comment and the comments are not expanded.
      // 2. the commentId + version refers to a comment reply, but replies have not been expanded.
      // 3. the commentId + version is on another page
      // 4. the comment/reply does not exist

      const argumentParameterValues = this._parseArgumentIdAndVersion(argumentIdWithVersion);
      const argumentId = argumentParameterValues.id;
      const argumentVersion = argumentParameterValues.version || 0;

      if (!argumentId) {
        return console.error('this.goToArgument', 'No argumentId and/or version provided, nothing to do here', argumentIdWithVersion);
      }
      console.log(items, argumentId)
      for (let i = 0; i < items.length; i++) {
        // 1. the commentId + version refers to another version of the comment and the comments are not expanded.
        if (items[i] === argumentId) {
          items[i].showEdits = true;
          const commentElement: HTMLElement | null = document.getElementById(argumentIdWithVersion);
          this.scrollTo(commentElement);
        } else { // 2. the commentId + version refers to a comment reply, but replies have not been expanded.
          for (let j = 0; j < items[i].children.length; j++) {
            if (items[i].children[j].id === argumentId) {
              const id = items[i].id;
              setTimeout(() => {
                console.log('CLICK')
                document.getElementById(id + '_replies')?.click();
                const el : HTMLElement | null = document.getElementById(argumentIdWithVersion);
                console.log(el);
                this.scrollTo(el)
              }, 300)

              // Expand edits only if an actual edit is referenced.
              const replyEdits = items[i].children[j].edits;
              if (replyEdits.length && argumentVersion !== replyEdits.length - 1) {
                items[i].children[j].showEdits = true; // In case the reply has edits and that is referenced.
              }

              /*  this.$timeout(() => { // TODO:  After "showEdits" is set, angular will render the edits and that takes time. Any better way to detect of it to be done?
                  this.app.scrollToAnchor(commentIdWithVersion)
                    .then(() => {
                      const commentElement = angular.element(this.$document[0].getElementById(commentIdWithVersion));
                      commentElement.addClass('highlight');
                      this.$state.commentId = commentIdWithVersion;
                      this.$timeout(() => {
                        commentElement.removeClass('highlight');
                      }, 500);
                    });
                }, 100);*/

              // Break the outer loop when the inner reply loop finishes as there is no more work to do.
              i = items.length;

              break;
            }
          }
        }
      }
    }
  };

  getFoldersInfo(folders: Folder[]) {
    const foldersText = <string[]>[];
    folders.forEach(folder => foldersText.push(`<span class="folder">${folder.name}</span>`));
    const value = this.Translate.instant('COMPONENTS.IDEA_DIALOG.FOLDERS', { folders: foldersText.join(',') });

    return value;
  }
}
