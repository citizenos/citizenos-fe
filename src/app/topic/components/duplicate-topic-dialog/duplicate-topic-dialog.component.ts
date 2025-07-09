import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from 'src/app/shared/dialog';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'duplicate-topic-dialog',
  templateUrl: './duplicate-topic-dialog.component.html',
  styleUrls: ['./duplicate-topic-dialog.component.scss'],
  standalone: false
})
export class DuplicateTopicDialogComponent {
  topic!: Topic;
  constructor (@Inject(DIALOG_DATA) private data: any ) {
    this.topic = data.topic;
  }
}
