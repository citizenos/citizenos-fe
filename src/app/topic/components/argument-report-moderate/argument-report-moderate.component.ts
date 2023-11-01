import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Argument } from 'src/app/interfaces/argument';
import { switchMap, take, combineLatest } from 'rxjs';

@Component({
  selector: 'app-argument-report-moderate',
  templateUrl: './argument-report-moderate.component.html',
  styleUrls: ['./argument-report-moderate.component.scss']
})
export class ArgumentReportModerateComponent implements OnInit {
  argument!: Argument;
  reportTypes = Object.keys(this.TopicArgumentService.ARGUMENT_REPORT_TYPES);
  topicId!: string;
  token!: string;
  report: any = {
    type: '',
    text: ''
  };
  errors?: any;
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private TopicArgumentService: TopicArgumentService, private dialog: MatDialog) {
    this.token = data.token;
    this.argument = data.argument;
    this.topicId = data.topicId;
    this.report = data.report;
  }

  ngOnInit(): void {
  }

  doModerate() {
/*TODO resove data */
    const data = {
      token: this.token,
      topicId: this.topicId,
      commentId: this.argument.id,
      reportId: this.report.id,
      report: this.report
    }
    this.TopicArgumentService.moderate(data).pipe(take(1))
    .subscribe({
      next:() => {
        this.dialog.closeAll();
      },
      error: (err) => {
        console.log(err);
      }
    })
  };

}

@Component({
  selector: 'app-argument-report-moderate-dialog',
  template: '',
})
export class ArgumentReportModerateDialogComponent {
  topicId: string = '';
  token: string = '';
  constructor(dialog: MatDialog, router: Router, route: ActivatedRoute, TopicArgumentService: TopicArgumentService) {
    /*TODO resove queryParam token */
    combineLatest([route.params, route.queryParams]).pipe(switchMap(([params, query]) => {
      this.topicId = params['topicId'];
      this.token = query['token'];
        return TopicArgumentService.getReport({
          topicId: params['topicId'],
          commentId: params['commentId'],
          reportId: params['reportId'],
          token: query['token']
      });
    })).pipe(take(1))
      .subscribe((report) => {
        const reportDialog = dialog.open(ArgumentReportModerateComponent, { data: { report: report, argument: report.comment, topicId: this.topicId, token: this.token } });

        reportDialog.afterClosed().subscribe((confirm) => {
          return router.navigate(['/']);
        })
      });
  }

}