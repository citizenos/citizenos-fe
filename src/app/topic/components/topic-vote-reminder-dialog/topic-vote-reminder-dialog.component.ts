import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from 'src/app/shared/dialog';
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
  constructor(@Inject(DIALOG_DATA) data: any, Auth: AuthService) {
    this.user$ = Auth.user$;
    this.topic = data.topic;
    this.vote = data.vote;
  }

}
