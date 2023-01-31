import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { TopicReportFormData } from '../topic-report-form/topic-report-form.component';

@Component({
  selector: 'app-topic-report-resolve',
  templateUrl: './topic-report-resolve.component.html',
  styleUrls: ['./topic-report-resolve.component.scss']
})
export class TopicReportResolveComponent implements OnInit {
  topic!: Topic;
  isLoading = false;
  errors = <any>null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicReportFormData, private TopicReportService: TopicReportService) {
    this.topic = data.topic;
  }

  ngOnInit(): void {
  }

  doResolve() {
    this.isLoading = true;
    this.TopicReportService
      .resolve(
        {
          topicId: this.topic.id,
          id: this.topic.report?.id
        }
      ).pipe(take(1))
      .subscribe();
    /*   .$promise
       .then(() => {
           delete this.topic.report;
           this.ngDialog.closeAll();
       },(res) => {
           this.form.isLoading = false;
           this.$log.error('Failed to resolve the report', res);
       });*/
  };
}
