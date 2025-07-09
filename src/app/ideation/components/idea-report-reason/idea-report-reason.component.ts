import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from 'src/app/shared/dialog';

@Component({
  selector: 'app-idea-report-reason',
  templateUrl: './idea-report-reason.component.html',
  styleUrls: ['./idea-report-reason.component.scss'],
  standalone: false
})
export class IdeaReportReasonComponent {
  report: any;

  constructor (@Inject(DIALOG_DATA) data: any) {
    this.report = data.report;
  }
}
