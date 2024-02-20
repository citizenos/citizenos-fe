import { Argument } from 'src/app/interfaces/argument';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';
import { take } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-argument-report',
  templateUrl: './argument-report.component.html',
  styleUrls: ['./argument-report.component.scss']
})
export class ArgumentReportComponent implements OnInit {
  @ViewChild('reportText') reportTextInput!: ElementRef;
  argument!: Argument;
  reportTypes = Object.keys(this.TopicArgumentService.ARGUMENT_REPORT_TYPES);
  errors?:any;

  report = new UntypedFormGroup({
    type: new UntypedFormControl(this.reportTypes[0], Validators.required),
    text: new UntypedFormControl('', Validators.required),
    topicId: new UntypedFormControl(''),
    commentId: new UntypedFormControl(''),
  });
  constructor(
    private dialogRef: DialogRef<ArgumentReportComponent>,
    @Inject(DIALOG_DATA) private data: any,
    private TopicArgumentService: TopicArgumentService
    ) {
    this.argument = data.argument;
    this.report.value.commentId = data.argument.id;
    this.report.value.topicId = data.topicId;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.reportTextInput.nativeElement.focus();
  }

  doReport() {
    this.report.value.commentId = this.data.argument.id;
    this.report.value.topicId = this.data.topicId;
    this.TopicArgumentService.report(this.report.value).pipe(take(1))
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
