import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TopicAttachmentsComponent } from '../topic-attachments/topic-attachments.component';
import { TopicService } from 'src/app/services/topic.service';
import { take, switchMap } from 'rxjs';
@Component({
  selector: 'app-topic-attachments-dialog',
  templateUrl: './topic-attachments-dialog.component.html',
  styleUrls: ['./topic-attachments-dialog.component.scss']
})
export class TopicAttachmentsDialogComponent implements OnInit {

  constructor(dialog: MatDialog, router: Router, route: ActivatedRoute, TopicService: TopicService) {
    route.params.pipe(
      switchMap((params) => {
        return TopicService.get(params['topicId'])
      })
    ).pipe(take(1)).subscribe((topic) => {
      const attachmentsDialog = dialog.open(
        TopicAttachmentsComponent, {data: {
        topic
      }});

      attachmentsDialog.afterClosed().subscribe(() => {
        router.navigate(['../'], {relativeTo: route})
      })
    });
  }

  ngOnInit(): void {
  }

}
