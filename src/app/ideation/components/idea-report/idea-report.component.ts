import { Idea } from 'src/app/interfaces/idea';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { TopicIdeaService } from '@services/topic-idea.service';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';
import { take } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-idea-report',
  templateUrl: './idea-report.component.html',
  styleUrls: ['./idea-report.component.scss']
})
export class IdeaReportComponent {
  @ViewChild('reportText') reportTextInput!: ElementRef;
  idea!: Idea;
  reportTypes = Object.keys(this.TopicIdeaService.IDEA_REPORT_TYPES);
  errors?:any;

  report = new UntypedFormGroup({
    type: new UntypedFormControl(this.reportTypes[0], Validators.required),
    text: new UntypedFormControl('', Validators.required),
    topicId: new UntypedFormControl(''),
    ideaId: new UntypedFormControl(''),
    ideationId: new UntypedFormControl(''),
  });
  constructor(
    private dialogRef: DialogRef<IdeaReportComponent>,
    @Inject(DIALOG_DATA) private data: any,
    private TopicIdeaService: TopicIdeaService
    ) {
      console.log(data);
    this.idea = data.idea;
    this.report.value.ideaId = data.idea.id;
    this.report.value.topicId = data.topicId;
    this.report.value.ideationId = data.ideationId;
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
    this.report.value.ideaId = this.data.idea.id;
    this.report.value.topicId = this.data.topicId;
    this.report.value.ideationId = this.data.ideationId;
    this.TopicIdeaService.report(this.report.value).pipe(take(1))
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
