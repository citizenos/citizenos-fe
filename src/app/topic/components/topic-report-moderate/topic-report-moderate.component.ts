import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { switchMap, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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

  moderate = new UntypedFormGroup({
    id: new UntypedFormControl(''),
    type: new UntypedFormControl(this.reportTypes[0], Validators.required),
    text: new UntypedFormControl('', Validators.required),
    topicId: new UntypedFormControl(''),
  });
/*
  moderate = {
    id: '',
    type: this.reportTypes[0],
    text: '',
    topicId: ''
  };*/

  isLoading = false;
  errors = <any>null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicReportModerateData, private TopicReportService: TopicReportService, private dialog: MatDialog) {
    this.topic = data.topic;
  }

  ngOnInit(): void {

  }

  doModerate() {
    this.errors = null;
    this.isLoading = true;
    this.moderate.value.topicId = this.topic.id
    this.moderate.value.id = this.data.topic.report?.id;
    this.TopicReportService
      .moderate(this.moderate.value).pipe(take(1))
      .subscribe({
        next: (report) => {
          this.topic.report = report;
          this.dialog.closeAll();
        },
        error: (res) => {
          this.isLoading = false;
          this.errors = res.errors;
        }
      })
  };
}

@Component({
  selector: 'topic-report-moderate-dialog',
  template: '',
})
export class TopicReportModerateDialogComponent implements OnInit {

  constructor(dialog: MatDialog, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        dialog.open(TopicReportModerateComponent, { data: { topic } });
      })

  }

  ngOnInit(): void {
  }

}
