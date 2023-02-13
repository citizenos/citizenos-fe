import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Argument } from 'src/app/interfaces/argument';
import { switchMap, take } from 'rxjs';

@Component({
  selector: 'app-argument-report-moderate',
  templateUrl: './argument-report-moderate.component.html',
  styleUrls: ['./argument-report-moderate.component.scss']
})
export class ArgumentReportModerateComponent implements OnInit {
  argument!: Argument;
  reportTypes = Object.keys(this.TopicArgumentService.ARGUMENT_REPORT_TYPES);
  report: any = {
    type: '',
    text: ''
  };
  errors?: any;
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private TopicArgumentService: TopicArgumentService) {
    this.argument = data.argument;
    this.report = data.report;
  }

  ngOnInit(): void {
  }

  doModerate() {
/*TODO resove data */
    const data = {
     /* token: this.token,
      topicId: this.topic.id,
      commentId: this.argument.id,
      reportId: this.reportId*/
      report: this.report
    }
    this.TopicArgumentService.moderate(data).pipe(take(1))
    .subscribe({
      next:() => {},
      error: () => {}
    })
  };

}

@Component({
  selector: 'app-argument-report-moderate-dialog',
  template: '',
})
export class ArgumentReportModerateDialogComponent {
  constructor(dialog: MatDialog, route: ActivatedRoute, TopicArgumentService: TopicArgumentService) {
    /*TODO resove queryParam token */
    route.params.pipe(switchMap((params) => {
      return TopicArgumentService.getReport({
        topicId: params['topicId'],
        commentId: params['commentId'],
        reportId: params['reportId'],
        token: params['token']
      });
    })).pipe(take(1))
      .subscribe((report) => {
        dialog.open(ArgumentReportModerateComponent, { data: { report } });
      });
  }

}