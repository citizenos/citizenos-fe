import { Component, OnInit, Inject } from '@angular/core';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { TopicReportFormData } from '../topic-report-form/topic-report-form.component';
import { switchMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-topic-report-review',
  templateUrl: './topic-report-review.component.html',
  styleUrls: ['./topic-report-review.component.scss']
})
export class TopicReportReviewComponent implements OnInit {
  reportTypes = Object.keys(this.TopicReportService.TYPES);
  topic!: Topic;

  isLoading = false;
  errors = <any>null;

  review = new UntypedFormGroup({
    text: new UntypedFormControl('', Validators.required),
  });

  constructor(@Inject(DIALOG_DATA) public data: TopicReportFormData, private dialog: DialogService, private TopicReportService: TopicReportService) {
    this.topic = data.topic;
  }

  ngOnInit(): void {
  }

  doReview() {
    this.isLoading = true;
    if (!this.review.value.text) return;
    this.TopicReportService
      .review(
        {
          topicId: this.topic.id,
          id: this.topic.report?.id,
          text: this.review.value.text
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

  constructor(dialog: DialogService, router: Router, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        const reportDialog = dialog.open(TopicReportReviewComponent, { data: { topic } });
        reportDialog.afterClosed().subscribe(() => {
          TopicService.reloadTopic();
          router.navigate(['../../../'], {relativeTo: route});
        })
      })

  }

  ngOnInit(): void {
  }

}
