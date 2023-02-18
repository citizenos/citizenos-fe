import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, take } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupInviteUserService } from 'src/app/services/group-invite-user.service';
import { GroupService } from 'src/app/services/group.service';
import { TopicMemberInviteDeleteComponent } from 'src/app/topic/components/topic-member-invite-delete/topic-member-invite-delete.component';
@Component({
  selector: 'group-invite-user',
  templateUrl: './group-invite-user.component.html',
  styleUrls: ['./group-invite-user.component.scss']
})
export class GroupInviteUserComponent implements OnInit {
  @Input() invite?: any;
  @Input() group: Group | any;
  @Input() fields?: any;

  constructor(private dialog: MatDialog, private GroupService: GroupService, private GroupInviteUserService: GroupInviteUserService) { }

  ngOnInit(): void {
  }
  now() {
    return new Date();
  }
  canUpdate() {
    return this.GroupService.canUpdate(this.group);
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
        this.GroupInviteUserService.items$.pipe(take(1))
          .subscribe((invites) => {
            invites.forEach((invite: any) => {
              if (invite.user.id === this.invite.user.id) {
                promisesToResolve[invite.id] = this.GroupInviteUserService.delete(invite);
              }
            });

            forkJoin(promisesToResolve)
              .pipe(take(1))
              .subscribe((res: any) => {
                this.GroupInviteUserService.reset();
              })
          })
      } else if (isAll === '1') { // Delete single
        this.GroupInviteUserService.delete(this.invite).pipe(take(1)).subscribe(res => this.GroupInviteUserService.reset());
      }
    })
  };
}
