import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';

export interface TopicReportFormData {
  topic: Topic
}
@Component({
  selector: 'app-topic-report-form',
  templateUrl: './topic-report-form.component.html',
  styleUrls: ['./topic-report-form.component.scss']
})
export class TopicReportFormComponent implements OnInit {
  reportTypes = Object.keys(this.TopicReportService.TYPES);
  topic!: Topic;
  report = {
    type: this.reportTypes[0],
    text: '',
    topicId: ''
  };

  isLoading = false;
  errors = <any>null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicReportFormData, private TopicReportService: TopicReportService) {
    this.topic = data.topic;
    this.report.topicId = this.topic.id
  }

  ngOnInit(): void {
  }

  doReport() {
    this.errors = null;
    this.isLoading = true;

    this.TopicReportService
      .save(this.report)
      .pipe(take(1))
      .subscribe((report) => { }
        /* this.topic.report = {
             id: report.id
         };
*/
        /* this.ngDialog.closeAll();
         }, (res) => {
             this.form.errors = res.data.errors;
             this.form.isLoading = false;
         }*/
      );
  };
}
