import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Input, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, of, take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { Argument } from 'src/app/interfaces/argument';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';

@Component({
  selector: 'topic-arguments',
  templateUrl: './topic-arguments.component.html',
  styleUrls: ['./topic-arguments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopicArgumentsComponent implements OnInit {
  @Input() topic!: Topic;
  @ViewChild('post_argument_wrap') postArgumentEl?: ElementRef;
  wWidth = window.innerWidth;
  argumentTypes = Object.keys(this.TopicArgumentService.ARGUMENT_TYPES);
  arguments$ = of(<Argument[] | any[]>[]);
  orderByOptions = Object.keys(this.TopicArgumentService.ARGUMENT_ORDER_BY);
  focusArgumentSubject = false;
  constructor(
    private Auth: AuthService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private app: AppService,
    public TopicArgumentService: TopicArgumentService) {
      this.TopicArgumentService.setParam('limit', 5);
    this.arguments$ = this.TopicArgumentService.loadItems().pipe(tap(() => {
      this.route.queryParams.pipe(take(1), tap((params) => {
        setTimeout(() => {
          if (params['argumentId']) {
            this.goToArgument(params['argumentId'], null);
          }
        });
      })).subscribe();
    }));
  }

  ngOnInit(): void {
    this.TopicArgumentService.setParam('topicId', this.topic.id)
  }

  getArgumentPercentage (count: number) {
    return count/(this.TopicArgumentService.count.value.pro + this.TopicArgumentService.count.value.con) * 100 || 0;
  }

  doAddArgument() {
    if (this.Auth.loggedIn$.value) {
      this.postArgumentEl?.nativeElement.scrollIntoView();
      this.focusArgumentSubject = true;
    } else {
      this.app.doShowLogin();
    }
  };

  private _parseArgumentIdAndVersion(argumentIdWithVersion: string) {
    if (!argumentIdWithVersion) {
      return {
        commentId: null,
        commentVersion: null
      }
    }
    if (argumentIdWithVersion.length === 36) {
      argumentIdWithVersion = argumentIdWithVersion + this.TopicArgumentService.ARGUMENT_VERSION_SEPARATOR + '0';
    }
    const argumentIdAndVersionRegex = new RegExp('^([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12})' + this.TopicArgumentService.ARGUMENT_VERSION_SEPARATOR + '([0-9]+)$'); // SRC: https://gist.github.com/bugventure/f71337e3927c34132b9a#gistcomment-2238943
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
  goToArgument(argumentIdWithVersion: string, $event: any) {

    if (!argumentIdWithVersion || argumentIdWithVersion.indexOf(this.TopicArgumentService.ARGUMENT_VERSION_SEPARATOR) < 0) {
      console.error('Invalid input for this.goToComment. Expecting UUIDv4 comment ID with version. For example: "604670eb-27b4-48d0-b19b-b6cf6bde33b2_v0"', argumentIdWithVersion);
      return;
    }
    let commentElement: HTMLElement | null = document.getElementById(argumentIdWithVersion);
    // The referenced comment was found on the page displayed
    if (commentElement) {
      this.scrollTo(commentElement)
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

      this.TopicArgumentService.items$.pipe(take(1))
        .subscribe(
          (items: any) => {
            for (let i = 0; i < items.length; i++) {
              // 1. the commentId + version refers to another version of the comment and the comments are not expanded.
              if (items[i] === argumentId) {
                items[i].showEdits = true;
                const commentElement: HTMLElement | null = document.getElementById(argumentIdWithVersion);
                this.scrollTo(commentElement);
              } else { // 2. the commentId + version refers to a comment reply, but replies have not been expanded.
                for (let j = 0; j < items[i].replies.rows.length; j++) {
                  if (items[i].replies.rows[j].id === argumentId) {
                    const id = items[i].id;
                    setTimeout(() => {
                      document.getElementById(id + '_replies')?.click();
                      this.scrollTo(document.getElementById(argumentIdWithVersion))
                    }, 300)

                    // Expand edits only if an actual edit is referenced.
                    const replyEdits = items[i].replies.rows[j].edits;
                    if (replyEdits.length && argumentVersion !== replyEdits.length - 1) {
                      items[i].replies.rows[j].showEdits = true; // In case the reply has edits and that is referenced.
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
        )

    }
  };
}
