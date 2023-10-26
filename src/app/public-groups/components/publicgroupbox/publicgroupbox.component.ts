import { AuthService } from 'src/app/services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { Group } from 'src/app/interfaces/group';
import { GroupJoinService } from 'src/app/services/group-join.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { LoginDialogComponent } from 'src/app/account/components/login/login.component';
import { take } from 'rxjs';
import { GroupJoinComponent } from 'src/app/group/components/group-join/group-join.component';

@Component({
  selector: 'public-group-box',
  templateUrl: './publicgroupbox.component.html',
  styleUrls: ['./publicgroupbox.component.scss']
})
export class PublicgroupboxComponent implements OnInit {
  @Input() group = <Group>{}; // decorate the property with @Input()
  constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private GroupJoinService: GroupJoinService, private Auth: AuthService) { }

  ngOnInit(): void {
  }

  viewGroup() {
    this.router.navigate(['/groups', this.group.id]);
  }

  joinGroup() {
    if (!this.Auth.loggedIn$.value) {
      const loginDialog = this.dialog.open(LoginDialogComponent, {
        data: { redirectSuccess: ['/groups', this.group.id] }
      });
      loginDialog.afterClosed().subscribe(result => {
        console.log(`Login result: ${result}`);
      });
    } else {
      const joinDialog = this.dialog.open(GroupJoinComponent, {
        data: {
          group: this.group
        }
      })/*.openConfirm({
        template: '/views/modals/group_join_confirm.html',
        closeByEscape: false
    })*/
      joinDialog.afterClosed().subscribe((res) => {
        if (res === true) {
          this.GroupJoinService
            .join(this.group.join.token).pipe(take(1)).subscribe(
              {
                next: (res) => {
                  this.group.userLevel = res.userLevel;
                },
                error: (err) => {
                  console.error('Failed to join Topic', err)
                }
              }
            )
        }
      });
    }
  }
/*
  joinGroup() {
    if (!this.Auth.loggedIn$.value) {
      const loginDialog = this.dialog.open(LoginDialogComponent, {
        data: { redirectSuccess: ['/groups', this.group.id] }
      });
      loginDialog.afterClosed().subscribe(result => {
        console.log(`Login result: ${result}`);
      });
    } else {

      const joinDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'MODALS.GROUP_JOIN_CONFIRM_TXT_ARE_YOU_SURE',
          heading: 'MODALS.GROUP_JOIN_CONFIRM_HEADING',
          closeBtn: 'MODALS.GROUP_JOIN_CONFIRM_BTN_NO',
          confirmBtn: 'MODALS.GROUP_JOIN_CONFIRM_BTN_YES',
          info: 'MODALS.GROUP_JOIN_CONFIRM_TXT_DESC',
          points: ['MODALS.GROUP_JOIN_CONFIRM_TXT_POINT1', 'MODALS.GROUP_JOIN_CONFIRM_TXT_POINT2', 'MODALS.GROUP_JOIN_CONFIRM_TXT_POINT3']
        }
      });

      joinDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.GroupJoinService
            .join(this.group.join.token).pipe(take(1)).subscribe(
              {
                next: (res) => {
                  this.group.userLevel = res.userLevel;
                },
                error: (err) => {
                  console.error('Failed to join Topic', err)
                }
              }
            )
        }
      });
    }
  }*/
}
