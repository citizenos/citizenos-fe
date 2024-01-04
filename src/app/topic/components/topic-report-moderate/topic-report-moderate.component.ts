import { Component, OnInit, Inject } from '@angular/core';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { switchMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(@Inject(DIALOG_DATA) public data: TopicReportModerateData, private TopicReportService: TopicReportService, private dialog: DialogService) {
    this.topic = data.topic;
  }

  ngOnInit(): void {

  }

  changeText(event:any) {
    const text = this.moderate.value.text;
    if (text.length > 0 && text.length < 2024 ) {
      return this.errors = null;
    }
    return this.errors = {textlength: true}
  }

  changeType(type: string) {
    this.moderate.patchValue({ 'type': type });
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

  constructor(dialog: DialogService, router: Router, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        const reportDialog = dialog.open(TopicReportModerateComponent, { data: { topic } });
        reportDialog.afterClosed().subscribe(() => {
          TopicService.reloadTopic();
          router.navigate(['../../../'], {relativeTo: route});
        })
      })

  }

  ngOnInit(): void {
  }

}
