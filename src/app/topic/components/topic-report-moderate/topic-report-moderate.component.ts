import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';

export interface TopicReportModerateData {
  topic: Topic
};

@Component({
  selector: 'app-topic-report-moderate',
  templateUrl: './topic-report-moderate.component.html',
  styleUrls: ['./topic-report-moderate.component.scss']
})
export class TopicReportModerateComponent implements OnInit {
  reportTypes = Object.keys(this.TopicReportService.TYPES);
  topic!: Topic;
  moderate = {
    id: '',
    type: this.reportTypes[0],
    text: '',
    topicId: ''
  };

  isLoading = false;
  errors = <any>null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicReportModerateData, private TopicReportService: TopicReportService) {
    this.topic = data.topic;
    this.moderate.topicId = this.topic.id
    this.moderate.id = this.topic.report?.id || '';
  }

  ngOnInit(): void {
  }

  doModerate() {
    this.errors = null;
    this.isLoading = true;

    this.TopicReportService
      .moderate(this.moderate).pipe(take(1))
      .subscribe((report) => { })
    /*.$promise
    .then((report) => {
        this.topic.report = report;
        this.ngDialog.closeAll();
    },(res) => {
        this.form.isLoading = false;
        this.form.errors = res.data.errors;
    });*/
  };
}
