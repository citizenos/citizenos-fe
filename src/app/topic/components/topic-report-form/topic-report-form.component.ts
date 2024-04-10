import { Component, OnInit, Inject } from '@angular/core';
import { DialogService, DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';
import { take, switchMap } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { Validators, FormBuilder } from '@angular/forms';
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
  report: any;

  isLoading = false;
  errors = <any>null;

  constructor(formBuilder: FormBuilder, @Inject(DIALOG_DATA) public data: TopicReportFormData, @Inject(DialogRef) private dialog: DialogRef<TopicReportFormComponent>, private TopicReportService: TopicReportService) {
    this.topic = data.topic;
    this.report = formBuilder.group({
      type: [this.reportTypes[0], Validators.compose([Validators.required])],
      text: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2024)])]
    });
  }

  ngOnInit(): void {
  }

  changeText(event:any) {
    const text = this.report.value.text;
    if (text.length > 0 && text.length < 2024 ) {
      return this.errors = null;
    }
    return this.errors = {textlength: true}
  }

  changeType(type: string) {
    this.report.controls['type'].setValue(type);
  }

  doReport() {
    this.errors = null;
    this.isLoading = true;
    const report = Object.assign({topicId: this.data.topic.id}, this.report.value);

    this.TopicReportService
      .save(report)
      .pipe(take(1))
      .subscribe({
        next: (report) => {
          this.dialog.close();
        },
        error: (error) => {
          console.error('ERROR REPORT', error)
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

  constructor(dialog: DialogService, router: Router, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        const reportDialog = dialog.open(TopicReportFormComponent, { data: { topic } });
        reportDialog.afterClosed().subscribe(() => {
          TopicService.reloadTopic();
          router.navigate(['../'], { relativeTo: route })
        });
      });

  }

  ngOnInit(): void {
  }

}
