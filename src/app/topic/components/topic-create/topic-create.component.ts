import { trigger, state, style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, switchMap, tap, take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { AppService } from 'src/app/services/app.service';
import { TopicService } from 'src/app/services/topic.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';

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
    ])]
})
export class TopicCreateComponent implements OnInit {

  /**/
  topic$: Observable<Topic>;
  errors?: any;

  constructor(
    private app: AppService,
    public TopicService: TopicService,
    public translate: TranslateService,
    public GroupMemberTopicService: GroupMemberTopicService,
    private router: Router,
    private route: ActivatedRoute) {
    this.app.darkNav = true;
    // app.createNewTopic();
    this.topic$ = this.route.params.pipe(
      switchMap((params) => {
        if (params['topicId']) {
          return this.TopicService.get(params['topicId'])
        }
        return this.createTopic();
      })
    );
  }
  ngOnInit(): void {
  }

  createTopic() {
    const topic = {
      description: '<html><head></head><body></body></html>',
      visbility: this.TopicService.VISIBILITY.private
    };

    return this.TopicService.save(topic)
      .pipe(take(1),
        tap((topic: Topic) => {
          this.router.navigate([topic.id], { relativeTo: this.route });
        }));
    /*this.app.createNewTopic(this.topic.title, this.topic.visibility)
    .pipe(take(1))
    .subscribe({
      next: (topic:Topic) => {
      }
    })
    .unsubscribe();*/
  }
}
