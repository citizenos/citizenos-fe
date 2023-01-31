import { switchMap, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TopicReportModerateComponent } from '../topic-report-moderate/topic-report-moderate.component';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-report-moderate-dialog',
  templateUrl: './topic-report-moderate-dialog.component.html',
  styleUrls: ['./topic-report-moderate-dialog.component.scss']
})
export class TopicReportModerateDialogComponent implements OnInit {

  constructor(dialog: MatDialog, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        dialog.open(TopicReportModerateComponent, { data: { topic } });
      })

  }

  ngOnInit(): void {
  }

}
