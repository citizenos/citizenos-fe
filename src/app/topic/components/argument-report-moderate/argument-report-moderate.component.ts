import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Argument } from 'src/app/interfaces/argument';
import { switchMap, take, combineLatest } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-argument-report-moderate',
  templateUrl: './argument-report-moderate.component.html',
  styleUrls: ['./argument-report-moderate.component.scss']
})
export class ArgumentReportModerateComponent implements OnInit {
  argument!: Argument;
  reportTypes = Object.keys(this.TopicArgumentService.ARGUMENT_REPORT_TYPES);
  topicId = '';
  commentId = '';
  reportId = '';
  token = '';
  report = new UntypedFormGroup({
    type: new UntypedFormControl(this.reportTypes[0], Validators.required),
    text: new UntypedFormControl('', Validators.required),
  });
  errors?: any;
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private TopicArgumentService: TopicArgumentService) {
    this.argument = data.argument || data.report.comment;
    this.topicId = data.topicId;
    this.commentId = data.commentId;
    this.reportId = data.report.id;
    this.token = data.token;
    this.report.patchValue(data.report); //Object.assign({}, data.report);
    console.log(this.report.value.type);
  }

  ngOnInit(): void {
  }

  doModerate() {
    /*TODO resove data */
    const data = {
      token: this.token,
      topicId: this.topicId,
      commentId: this.argument.id,
      reportId: this.reportId,
      report: this.report.value
    }
    this.TopicArgumentService.moderate(data).pipe(take(1))
      .subscribe({
        next: () => { },
        error: () => { }
      })
  };

}

@Component({
  selector: 'app-argument-report-moderate-dialog',
  template: '',
})
export class ArgumentReportModerateDialogComponent {
  topicId = '';
  commentId = '';
  token = '';
  constructor(dialog: MatDialog, route: ActivatedRoute, TopicArgumentService: TopicArgumentService) {
    console.log('DIALOG MODERAET')
    /*TODO resove queryParam token */
    combineLatest([route.params, route.queryParams]).pipe(
      switchMap(([params, queryParams]) => {
        this.topicId = params['topicId'];
        this.commentId = params['commentId'];
        this.token = queryParams['token'];
        return TopicArgumentService.getReport({
          topicId: params['topicId'],
          commentId: params['commentId'],
          reportId: params['reportId'],
          token: queryParams['token']
        });
      }),
      take(1)
    ).subscribe({
      next: (report) => {
        console.log(report);
        dialog.open(ArgumentReportModerateComponent, { data: { report, topicId: this.topicId , commentId: this.commentId, token: this.token } });
      },
      error: (err) => {
        console.log(err.message || err.status.message);
      }
    });

  }

}
