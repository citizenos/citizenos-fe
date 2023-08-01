import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, switchMap } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  report = new UntypedFormGroup({
    type: new UntypedFormControl(this.reportTypes[0], Validators.required),
    text: new UntypedFormControl('', Validators.required),
    topicId: new UntypedFormControl('')
  });
  /*report = {
    type: this.reportTypes[0],
    text: '',
    topicId: ''
  };*/

  isLoading = false;
  errors = <any>null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TopicReportFormData, @Inject(MatDialogRef) private dialog: MatDialogRef<TopicReportFormComponent>, private TopicReportService: TopicReportService) {
    this.topic = data.topic;
  }

  ngOnInit(): void {
    this.report.value.topicId = this.data.topic.id;
  }

  doReport() {
    this.errors = null;
    this.isLoading = true;
    this.report.value.topicId = this.data.topic.id;
    const report = this.report.value;
    console.log('REPORT', report)
    this.TopicReportService
      .save(report)
      .pipe(take(1))
      .subscribe({
        next: (report) => {
          console.log(report);
          this.dialog.close();
        },
        error: (error) => {
          console.log('ERROR', error)
          this.dialog.close();
        }
      }
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

@Component({
  selector: 'topic-report-form-dialog',
  template: '',
})
export class TopicReportFormDialogComponent implements OnInit {

  constructor(dialog: MatDialog, router: Router, route: ActivatedRoute, TopicService: TopicService) {
    console.log('TOPICREPORTDIALOG')
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        console.log(topic);
        const reportDialog = dialog.open(TopicReportFormComponent, { data: { topic } });
        reportDialog.afterClosed().subscribe(() => router.navigate(['../'], {relativeTo: route}))

      })

  }

  ngOnInit(): void {
  }

}
