import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { TopicReportFormData } from '../topic-report-form/topic-report-form.component';
import { switchMap, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
@Component({
  selector: 'app-topic-report-review',
  templateUrl: './topic-report-review.component.html',
  styleUrls: ['./topic-report-review.component.scss']
})
export class TopicReportReviewComponent implements OnInit {
  reportTypes = Object.keys(this.TopicReportService.TYPES);
  topic!: Topic;
  text = '';

  isLoading = false;
  errors = <any>null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicReportFormData, private dialog: MatDialog, private TopicReportService: TopicReportService) {
    this.topic = data.topic;
  }

  ngOnInit(): void {
  }

  doReview() {
    console.log(this.text);
    this.isLoading = true;

    this.TopicReportService
      .review(
        {
          topicId: this.topic.id,
          id: this.topic.report?.id,
          text: this.text
        }
      ).pipe(take(1))
      .subscribe({
        next: () => this.dialog.closeAll(),
        error: (res) => {
          this.isLoading = false;
          this.errors = res.errors;
        }
      });
  };
}

@Component({
  selector: 'topic-report-review-dialog',
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
