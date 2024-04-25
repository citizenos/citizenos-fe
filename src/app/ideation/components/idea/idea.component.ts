import { TopicIdeaRepliesService } from './../../../services/topic-idea-replies.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { Component, Inject, inject } from '@angular/core';
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
  constructor(dialog: DialogService, route: ActivatedRoute, TopicIdeaService: TopicIdeaService, router: Router, TopicService: TopicService) {
    combineLatest([route.params, TopicIdeaService.items$]).pipe(take(1)).subscribe(([params, items]) => {
      console.log(params);
        const idea = items.find((idea) => idea.id === params['ideaId']);
        dialog.closeAll();
        TopicService.get(params['topicId']).pipe(take(1)).subscribe((topic) => {
          const ideaDialog = dialog.open(IdeaDialogComponent, {
            data: {
              idea,
              topic,
              ideationId: params['ideationId'],
              route: route
            }
          });

          ideaDialog.afterClosed().subscribe((value) => {
            if (value) {
              router.navigate(['/', 'topics', params['topicId']], {fragment: 'ideation'})
            }
          });
        })
    })
  }
}

@Component({
  selector: 'app-idea',
  templateUrl: './idea-dialog.component.html',
  styleUrls: ['./idea-dialog.component.scss']
})
export class IdeaDialogComponent extends IdeaboxComponent {
  data:any = inject(DIALOG_DATA);
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
    this.ideationId = this.data.ideationId;
    this.route = this.data.route;
    const url = this.router.parseUrl(this.router.url);
    console.log(this.route)
    this.replies$ = combineLatest([this.route.params]).pipe(switchMap(([params]) => {
      return this.TopicIdeaRepliesService.getArguments(params);
    }));
  }

  prevIdea(ideas: Idea[]) {
    let index = ideas.findIndex((item) => item.id === this.idea.id);
    if (index === 0) index = ideas.length;
    const newIdea = ideas[index-1];
    this.router.navigate(['/', this.Translate.currentLang, 'topics', this.topic.id, 'ideation', this.ideationId, 'ideas', newIdea.id]);
    this.idea = newIdea;
  }

  nextIdea(ideas: Idea[]) {
    let index = ideas.findIndex((item) => item.id === this.idea.id);
    if (index === ideas.length-1) index = -1;
    const newIdea = ideas[index+1];
    this.router.navigate(['/', this.Translate.currentLang, 'topics', this.topic.id, 'ideation', this.ideationId, 'ideas', newIdea.id]);
    this.idea = newIdea;
  }
}
