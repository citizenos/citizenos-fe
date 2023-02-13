import { Argument } from 'src/app/interfaces/argument';
import { Component, OnInit, Inject } from '@angular/core';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';

@Component({
  selector: 'app-argument-report',
  templateUrl: './argument-report.component.html',
  styleUrls: ['./argument-report.component.scss']
})
export class ArgumentReportComponent implements OnInit {
  argument!: Argument;
  reportTypes = Object.keys(this.TopicArgumentService.ARGUMENT_REPORT_TYPES);
  errors?:any;

  report = {
    type: this.reportTypes[0],
    text: '',
    topicId: '',
    commentId: ''
  }
  constructor(
    private dialogRef: MatDialogRef<ArgumentReportComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private TopicArgumentService: TopicArgumentService
    ) {
    this.argument = data.argument;
    this.report.commentId = data.argument.id;
    this.report.topicId = data.topicId;
  }

  ngOnInit(): void {
  }

  doReport() {
    console.log(this.report)
    this.TopicArgumentService.report(this.report).pipe(take(1))
    .subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (res) => {
        this.errors = res.errors
      }
    });
  }
}
