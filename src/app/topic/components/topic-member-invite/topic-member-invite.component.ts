import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';
import { take, forkJoin } from 'rxjs';
import { TopicMemberInviteDeleteComponent } from '../topic-member-invite-delete/topic-member-invite-delete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'topic-member-invite',
  templateUrl: './topic-member-invite.component.html',
  styleUrls: ['./topic-member-invite.component.scss']
})
export class TopicMemberInviteComponent implements OnInit {
  @Input() invite?: any;
  @Input() topic: Topic | any;
  @Input() fields?: any;

  constructor(
    public TopicService: TopicService,
    private TopicInviteUserService: TopicInviteUserService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  now() {
    return new Date();
  }

  doDeleteInviteUser() {
    const deleteDialog = this.dialog
      .open(TopicMemberInviteDeleteComponent, {
        data: {
          user: this.invite.user
        }
      });
    deleteDialog.afterClosed().subscribe((isAll) => {
      const promisesToResolve = <any>{};
      // Delete all
      if (isAll === 'all') {
        this.TopicInviteUserService.items$.pipe(take(1))
          .subscribe((invites) => {
            invites.forEach((invite: any) => {
              if (invite.user.id === this.invite.user.id) {
                promisesToResolve[invite.id] = this.TopicInviteUserService.delete(invite);
              }
            });

            forkJoin(promisesToResolve)
              .pipe(take(1))
              .subscribe((res: any) => {
                this.TopicInviteUserService.reset();
              })
          })
      } else if (isAll === '1') { // Delete single
        this.TopicInviteUserService.delete(this.invite).pipe(take(1)).subscribe(res => this.TopicInviteUserService.reset());
      }
    })
  };
}
