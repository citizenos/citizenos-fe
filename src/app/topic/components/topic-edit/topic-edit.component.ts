import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, Observable, tap, BehaviorSubject } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { DialogService } from 'src/app/shared/dialog';
import { BlockNavigationIfChange } from 'src/app/shared/pending-changes.guard';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.component.html',
  styleUrls: ['./topic-edit.component.scss']
})
export class TopicEditComponent implements BlockNavigationIfChange {
  @ViewChild('imageUpload') fileInput?: ElementRef;

  topic$: Observable<Topic>;
  hasChanges$ = new BehaviorSubject(<boolean>false);

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
