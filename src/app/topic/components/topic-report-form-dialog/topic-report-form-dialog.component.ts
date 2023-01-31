import { switchMap, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TopicReportFormComponent } from '../topic-report-form/topic-report-form.component';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-report-form-dialog',
  templateUrl: './topic-report-form-dialog.component.html',
  styleUrls: ['./topic-report-form-dialog.component.scss']
})
export class TopicReportFormDialogComponent implements OnInit {

  constructor(dialog: MatDialog, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        dialog.open(TopicReportFormComponent, { data: { topic } });
      })

  }

  ngOnInit(): void {
  }

}
