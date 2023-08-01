import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'app-duplicate-topic-dialog',
  templateUrl: './duplicate-topic-dialog.component.html',
  styleUrls: ['./duplicate-topic-dialog.component.scss']
})
export class DuplicateTopicDialogComponent {
  topic!: Topic;
  constructor (@Inject(MAT_DIALOG_DATA) private data: any ) {
    this.topic = data.topic;
  }
}
