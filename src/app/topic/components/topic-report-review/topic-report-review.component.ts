import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { TopicReportFormData } from '../topic-report-form/topic-report-form.component';

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
  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicReportFormData, private TopicReportService: TopicReportService) {
    this.topic = data.topic;
  }

  ngOnInit(): void {
  }

  doReview () {
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
        .subscribe()
        /*.$promise
        .then(() => {
            this.ngDialog.closeAll();
        },(res) => {
            this.isLoading = false;
            this.errors = res.data.errors;
        });*/
};
}
