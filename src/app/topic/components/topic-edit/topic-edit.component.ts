import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, Observable, tap } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { DialogService } from 'src/app/shared/dialog';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.component.html',
  styleUrls: ['./topic-edit.component.scss']
})
export class TopicEditComponent {
  @ViewChild('imageUpload') fileInput?: ElementRef;

  topic$: Observable<Topic>;

  constructor(
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    public TopicService: TopicService
  ) {
    this.topic$ = this.route.params.pipe(
      switchMap((params) => {
        return this.TopicService.loadTopic(params['topicId'])
      }),
    )
  }

}
