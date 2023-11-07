import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-topic-report-reason',
  templateUrl: './topic-report-reason.component.html',
  styleUrls: ['./topic-report-reason.component.scss']
})
export class TopicReportReasonComponent {
  report: any;

  constructor (@Inject(MAT_DIALOG_DATA) data: any) {
    this.report = data.report;
  }

}
