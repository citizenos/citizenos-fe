import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TopicInviteComponent } from '../../../topic/components/topic-invite/topic-invite.component';

@Component({
  selector: 'topic-invite-dialog',
  template: '',
})
export class TopicInviteDialogComponent implements OnInit {

  constructor(dialog:MatDialog) {
    const inviteDialog = dialog.open(TopicInviteComponent);
  }

  ngOnInit(): void {
  }

}
