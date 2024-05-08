import { TopicIdeaRepliesService } from './../../../services/topic-idea-replies.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DIALOG_DATA, DialogService } from 'src/app/shared/dialog';
import { take, combineLatest, Observable, switchMap, of } from 'rxjs';
import { Idea } from 'src/app/interfaces/idea';
import { AuthService } from 'src/app/services/auth.service';
import { IdeaboxComponent } from '../ideabox/ideabox.component';
import { ConfigService } from 'src/app/services/config.service';
import { LocationService } from 'src/app/services/location.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Argument } from 'src/app/interfaces/argument';
import { TopicService } from 'src/app/services/topic.service';

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
      dialog.closeAll();
      TopicService.get(this.topicId).pipe(take(1)).subscribe((topic) => {
        const ideaDialog = dialog.open(IdeaDialogComponent, {
          data: {
            idea,
            topic,
            ideation: {id: this.ideationId},
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
  data: any = inject(DIALOG_DATA);
  route;
  TopicIdeaRepliesService = inject(TopicIdeaRepliesService);
  replies$: Observable<any>;
  argument = <Argument>{};
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
    this.replies$ = combineLatest([this.route.params, this.TopicIdeaRepliesService.loadReplies$]).pipe(switchMap(([params]) => {
      return this.TopicIdeaRepliesService.getArguments(params);
    }));
  }

  prevIdea(ideas: Idea[]) {
    let index = ideas.findIndex((item) => item.id === this.idea.id);
    if (index === 0) index = ideas.length;
    const newIdea = ideas[index - 1];
    this.router.navigate(['/', this.Translate.currentLang, 'topics', this.topic.id, 'ideation', this.ideation.id, 'ideas', newIdea.id]);
    this.idea = newIdea;
  }

  nextIdea(ideas: Idea[]) {
    let index = ideas.findIndex((item) => item.id === this.idea.id);
    if (index === ideas.length - 1) index = -1;
    const newIdea = ideas[index + 1];
    this.router.navigate(['/', this.Translate.currentLang, 'topics', this.topic.id, 'ideation', this.ideation.id, 'ideas', newIdea.id]);
    this.idea = newIdea;
  }
}
