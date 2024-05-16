import { TopicIdeationService } from './../../../services/topic-ideation.service';
import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicService } from 'src/app/services/topic.service';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { take } from 'rxjs';

@Component({
  selector: 'topic-discussion-create-dialog',
  templateUrl: './topic-discussion-create-dialog.component.html',
  styleUrls: ['./topic-discussion-create-dialog.component.scss']
})
export class TopicDiscussionCreateDialogComponent {
  topic!: Topic;
  title: string = '';

  private dialog = inject(DialogService);
  private data = inject(DIALOG_DATA);

  constructor(public TopicService: TopicService,
    public TopicIdeationService: TopicIdeationService,
    public Translate: TranslateService,
    public Notification: NotificationService,
    @Inject(ActivatedRoute) public route: ActivatedRoute,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    this.topic = this.data.topic;
  }

  startDiscussion() {
    this.TopicIdeationService.update({ topicId: this.topic.id, ideationId: this.topic.ideationId, deadline: new Date() }).pipe(take(1)).subscribe({
      next: () => {
        this.TopicService.reloadTopic();
        return this.TopicService.changeState(this.topic, this.TopicService.STATUSES.inProgress, this.route.toString());
      }
    });

  }
}
