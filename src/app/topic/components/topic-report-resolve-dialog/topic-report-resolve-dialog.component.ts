import { switchMap, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TopicReportResolveComponent } from '../topic-report-resolve/topic-report-resolve.component';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-report-resolve-dialog',
  template: '',
  styleUrls: []
})
export class TopicReportResolveDialogComponent implements OnInit {

  constructor(dialog: MatDialog, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(switchMap((params) => {
      return TopicService.get(params['topicId']);
    })).pipe(take(1))
      .subscribe((topic) => {
        dialog.open(TopicReportResolveComponent, { data: { topic } });
      })

  }

  ngOnInit(): void {
  }

}
