import { Topic } from 'src/app/interfaces/topic';
import { Event } from 'src/app/interfaces/event';
import { Component, OnInit, Input } from '@angular/core';
import { TopicEventService } from 'src/app/services/topic-event.service';
import { TopicService } from 'src/app/services/topic.service';
import { DialogService } from 'src/app/shared/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { take, of } from 'rxjs';
@Component({
  selector: 'topic-milestones',
  templateUrl: './topic-milestones.component.html',
  styleUrls: ['./topic-milestones.component.scss']
})
export class TopicMilestonesComponent implements OnInit {
  @Input() topic!: Topic;
  event = {
    subject: '',
    text: '',
    topicId: ''
  };

  errors = <any>null;
  public topicEvents = of(<Event[] | any[]>[]);
  public countTotal;
  public maxLengthSubject = 128;
  public maxLengthText = 2048;
  constructor(private dialog: DialogService, private TopicEventService: TopicEventService, private TopicService: TopicService) {
    this.topicEvents = this.TopicEventService.loadItems();
    this.countTotal = this.TopicEventService.countTotal$;
  }

  ngOnInit(): void {
    this.TopicEventService.setParam('topicId', this.topic.id);
    this.event.topicId = this.topic.id;
  }

  submitEvent() {
    this.TopicEventService
      .save(this.event)
      .pipe(take(1))
      .subscribe(() => {
        this.event.subject = '';
        this.event.text = '';
        this.TopicEventService.reset();
      });
  };

  canEdit () {
    return this.TopicService.canEdit(this.topic);
  }

  canDelete () {
    return this.TopicService.canDelete(this.topic);
  }

  deleteEvent(event: any) {
    event.topicId = this.topic.id;
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_EVENT_DELETE_CONFIRM_HEADING',
        title: 'MODALS.TOPIC_EVENT_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: event.subject,
        points: ['MODALS.TOPIC_EVENT_DELETE_CONFIRM_TXT_ARE_YOU_SURE'],
        confirmBtn: 'MODALS.TOPIC_EVENT_DELETE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.TOPIC_EVENT_DELETE_CONFIRM_BTN_NO'
      }
    });

    deleteDialog.afterClosed().subscribe((result:any) => {
      if (result === true) {
        this.TopicEventService
          .delete(event)
          .pipe(take(1))
          .subscribe(() => {
            this.event.subject = '';
            this.event.text = '';
            this.TopicEventService.reset();
          });
      }
    });
    /*
        this.ngDialog
          .openConfirm({
            template: '/views/modals/topic_event_delete_confirm.html',
            data: {
              event: event
            }
          })
          .then(() => {
            event.topicId = this.topic.id;
            this.TopicEventService
              .delete(event)
              .then(() => {
                this.init();
              });
          }, angular.noop);*/

  }
}
