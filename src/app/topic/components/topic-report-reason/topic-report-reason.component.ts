import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from 'src/app/shared/dialog';
@Component({
  selector: 'app-topic-report-reason',
  templateUrl: './topic-report-reason.component.html',
  styleUrls: ['./topic-report-reason.component.scss']
})
export class TopicReportReasonComponent {
  report: any;

  constructor (@Inject(DIALOG_DATA) data: any) {
    this.report = data.report;
  }

}
