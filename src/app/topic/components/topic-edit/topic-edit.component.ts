import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, Observable, tap } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.component.html',
  styleUrls: ['./topic-edit.component.scss']
})
export class TopicEditComponent {
  @ViewChild('imageUpload') fileInput?: ElementRef;

  topic$: Observable<Topic>;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public TopicService: TopicService
  ) {
    this.topic$ = this.route.params.pipe(
      switchMap((params) => {
        return this.TopicService.get(params['topicId'])
      }),
      tap((topic) => {
        if (!this.TopicService.canEdit(topic)) {
          const infoDialog = this.dialog.open(ConfirmDialogComponent, {
            data: {
              level: 'info',
              heading: 'MODALS.USER_DELETE_CONFIRM_HEADING',
              title: 'MODALS.USER_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
              description: 'MODALS.USER_DELETE_CONFIRM_TXT_NO_UNDO',
              points: ['MODALS.USER_DELETE_CONFIRM_TXT_USER_DELETED', 'MODALS.USER_DELETE_CONFIRM_TXT_KEEP_DATA_ANONYMOUSLY'],
              confirmBtn: 'MODALS.USER_DELETE_CONFIRM_YES'
            }
          });
        }
      })
    )
  }

}
