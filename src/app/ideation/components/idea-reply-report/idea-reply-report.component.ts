import { Argument } from 'src/app/interfaces/argument';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';
import { take } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { TopicIdeaRepliesService } from '@services/topic-idea-replies.service';

@Component({
  selector: 'idea-reply-report',
  templateUrl: './idea-reply-report.component.html',
  styleUrls: ['./idea-reply-report.component.scss']
})
export class IdeaReplyReportComponent {
  @ViewChild('reportText') reportTextInput!: ElementRef;
  argument!: Argument;
  reportTypes = Object.keys(this.TopicIdeaRepliesService.ARGUMENT_REPORT_TYPES);
  errors?: any;

  report = new UntypedFormGroup({
    type: new UntypedFormControl(this.reportTypes[0], Validators.required),
    text: new UntypedFormControl('', Validators.required),
    topicId: new UntypedFormControl(''),
    ideationId: new UntypedFormControl(''),
    ideaId: new UntypedFormControl(''),
    commentId: new UntypedFormControl(''),
  });
  constructor(
    private dialogRef: DialogRef<IdeaReplyReportComponent>,
    @Inject(DIALOG_DATA) private data: any,
    private TopicIdeaRepliesService: TopicIdeaRepliesService
  ) {
    console.log(data);
    this.argument = data.argument;
    this.report.value.commentId = data.argument.id;
    this.report.value.topicId = data.topicId;
    this.report.value.ideaId = data.ideaId;
    this.report.value.ideationId = data.ideationId;
    this.report.patchValue({
      commentId: data.argument.id,
      topicId: data.topicId,
      ideaId: data.ideaId,
      ideationId: data.ideationId
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.reportTextInput.nativeElement.focus();
  }

  selectReportType(type: string) {
    this.report.controls['type'].setValue(type);
  }

  doReport() {
    this.TopicIdeaRepliesService.report(this.report.value).pipe(take(1))
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
