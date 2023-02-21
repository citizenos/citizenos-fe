import { ReportData } from 'src/app/interfaces/dialogdata';
import { Topic } from 'src/app/interfaces/topic';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-topic-report',
  templateUrl: './topic-report.component.html',
  styleUrls: ['./topic-report.component.scss']
})
export class TopicReportComponent implements OnInit {
  topic: Topic;
  constructor(@Inject(MAT_DIALOG_DATA) data: ReportData) {
    this.topic = data.topic;
  }

  ngOnInit(): void {
  }

}
