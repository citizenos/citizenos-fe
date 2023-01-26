import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-topic-member-invite-delete',
  templateUrl: './topic-member-invite-delete.component.html',
  styleUrls: ['./topic-member-invite-delete.component.scss']
})
export class TopicMemberInviteDeleteComponent implements OnInit {
  user!: any;
  constructor( @Inject(MAT_DIALOG_DATA) public data:any) {
    this.user=data.user;
  }

  ngOnInit(): void {
  }

}
