import { trigger, state, style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, switchMap, tap, take, combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from '@services/app.service';
import { TopicService } from '@services/topic.service';
import { DialogService } from 'src/app/shared/dialog';
import { BlockNavigationIfChange } from 'src/app/shared/pending-changes.guard';
import { TopicDiscussionService } from '@services/topic-discussion.service';

@Component({
  selector: 'app-topic-create',
  templateUrl: './topic-create.component.html',
  styleUrls: ['./topic-create.component.scss'],
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
    ])],
  standalone: false
})
export class TopicCreateComponent implements OnInit, BlockNavigationIfChange {

  /**/
  topic$: Observable<Topic>;
  topic?: Topic;
  groupId?: string;
  errors?: any;
  hasChanges$ = new BehaviorSubject(<boolean>false);

  constructor(
    private app: AppService,
    public TopicService: TopicService,
    public translate: TranslateService,
    private TopicDiscussionService: TopicDiscussionService,
    private router: Router,
    private Dialog: DialogService,
    private route: ActivatedRoute) {
    this.app.darkNav = true;
    // app.createNewTopic();
    this.topic$ = combineLatest([this.route.params, this.route.queryParams]).pipe(
      switchMap(([params, queryParams]) => {
        if (queryParams['groupId']) this.groupId = queryParams['groupId'];
        if (params['topicId']) {
          return this.TopicService.loadTopic(params['topicId'])
        }
        return this.createTopic(queryParams);
      }),
      tap((topic) => this.topic = topic)
    );
  }
  ngOnInit(): void {
  }

  createTopic(params?:any) {
    const topic = {
      description: '<html><head></head><body></body></html>',
      status: this.TopicService.STATUSES.draft,
      visbility: this.TopicService.VISIBILITY.private
    };

    return this.TopicService.save(topic)
      .pipe(take(1),
        tap((topic: Topic) => {
            const createDiscussion: any = {
              topicId: topic.id,
              creatorId: '',
              question: ' ',
              deadline: null,
              createdAt: '',
              updatedAt: ''
            };
            this.TopicDiscussionService.save(createDiscussion)
              .pipe(take(1))
              .subscribe({
                next: (discussion) => {
                  this.router.navigate([topic.id], { relativeTo: this.route });
                }
              });
        }));
    /*this.app.createNewTopic(this.topic.title, this.topic.visibility)
    .pipe(take(1))
    .subscribe({
      next: (topic:Topic) => {
      }
    })
    .unsubscribe();*/
  }

  removeChanges() {
    if (this.topic)
      this.TopicService.revert(this.topic.id, this.topic.revision!).pipe(take(1)).subscribe({
        next: () => {
          setTimeout(() => {
            this.TopicService.reloadTopic();
          }, 200);
        }
      });
  }
}
