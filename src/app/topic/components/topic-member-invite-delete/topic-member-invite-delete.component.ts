import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-topic-member-invite-delete',
  templateUrl: './topic-member-invite-delete.component.html',
  styleUrls: ['./topic-member-invite-delete.component.scss']
})
export class TopicMemberInviteDeleteComponent implements OnInit {
  user!: any;
  invitesToDelete = <string | null>null;
  constructor( @Inject(MAT_DIALOG_DATA) public data:any, private dialog: MatDialogRef<TopicMemberInviteDeleteComponent>) {
    this.user=data.user;
  }

  ngOnInit(): void {
  }


  removeInvites () {
    if(this.invitesToDelete !== null) {
      this.dialog.close(this.invitesToDelete);
    }
  }
}
