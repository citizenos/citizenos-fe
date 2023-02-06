import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TopicSettingsComponent} from 'src/app/topic/components/topic-settings/topic-settings.component';
import { ActivatedRoute, Router} from '@angular/router';
import { TopicService} from 'src/app/services/topic.service';
import { switchMap, take } from 'rxjs';
@Component({
  selector: 'app-topic-settings-dialog',
  template: ''
})
export class TopicSettingsDialogComponent implements OnInit {

  constructor(dialog: MatDialog, route: ActivatedRoute, router: Router, TopicService: TopicService) {
    route.params.pipe(
      switchMap((params) => {
        return TopicService.get(params['topicId'])
      })
    ).pipe(take(1)).subscribe((topic) => {
      const settingsDialog = dialog.open(TopicSettingsComponent, {data: {
        topic
      }});
      settingsDialog.afterClosed().subscribe(() => {
        router.navigate(['../'], {relativeTo: route})
      })
    });

  }

  ngOnInit(): void {
  }

}
