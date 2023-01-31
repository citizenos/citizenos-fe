import { switchMap, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TopicReportReviewComponent } from '../topic-report-review/topic-report-review.component';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-report-review-dialog',
  template: '',
})
export class TopicReportReviewDialogComponent implements OnInit {

  constructor(dialog: MatDialog, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        dialog.open(TopicReportReviewComponent, { data: { topic } });
      })

  }

  ngOnInit(): void {
  }

}
