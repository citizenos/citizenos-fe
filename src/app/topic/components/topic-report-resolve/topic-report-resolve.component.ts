import { Component, OnInit, Inject } from '@angular/core';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { Topic } from 'src/app/interfaces/topic';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { TopicReportFormData } from '../topic-report-form/topic-report-form.component';
import { switchMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
@Component({
  selector: 'app-topic-report-resolve',
  templateUrl: './topic-report-resolve.component.html',
  styleUrls: ['./topic-report-resolve.component.scss']
})
export class TopicReportResolveComponent implements OnInit {
  topic!: Topic;
  isLoading = false;
  errors = <any>null;
  constructor(@Inject(DIALOG_DATA) public data: TopicReportFormData, private dialog: DialogService, private TopicReportService: TopicReportService,
  private router: Router, private TopicService: TopicService) {
    this.topic = data.topic;
  }

  ngOnInit(): void {
  }

  doResolve() {
    this.isLoading = true;
    this.TopicReportService
      .resolve(
        {
          topicId: this.topic.id,
          id: this.topic.report?.id
        }
      ).pipe(take(1))
      .subscribe({
        next: () => {
          this.dialog.closeAll();
          this.TopicService.reloadTopic();
          this.router.navigate(['/', 'topics', this.topic.id])
        },
        error: (res) => {
          this.isLoading = false;
           console.error('Failed to resolve the report', res);
        }
      });
  };
}

@Component({
  selector: 'app-topic-report-resolve-dialog',
  template: '',
  styleUrls: []
})
export class TopicReportResolveDialogComponent implements OnInit {

  constructor(dialog: DialogService, router: Router, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        const reportDialog = dialog.open(TopicReportResolveComponent, { data: { topic } });

        reportDialog.afterClosed().subscribe(() => {
          TopicService.reloadTopic();
          router.navigate(['topics', topic.id], );
        })
      })

  }

  ngOnInit(): void {
  }

}
