import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-topic-vote-reminder-dialog',
  templateUrl: './topic-vote-reminder-dialog.component.html',
  styleUrls: ['./topic-vote-reminder-dialog.component.scss']
})
export class TopicVoteReminderDialog {
  vote;
  user$;
  topic;
  today = new Date();
  constructor(@Inject(MAT_DIALOG_DATA) data: any, Auth: AuthService) {
    this.user$ = Auth.user$;
    this.topic = data.topic;
    this.vote = data.vote;
  }

}
