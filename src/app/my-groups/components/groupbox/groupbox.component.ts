import { AuthService } from '@services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog';
import { Router } from '@angular/router';

import { Group } from 'src/app/interfaces/group';
import { GroupJoinService } from '@services/group-join.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { LoginDialogComponent } from 'src/app/account/components/login/login.component';
import { take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'group-box',
  templateUrl: './groupbox.component.html',
  styleUrls: ['./groupbox.component.scss'],
  standalone: false
})
export class GroupboxComponent implements OnInit {
  @Input() group = <Group>{}; // decorate the property with @Input()
  constructor(private dialog: DialogService, private router: Router, private GroupJoinService: GroupJoinService, private Auth: AuthService, public Translate: TranslateService) { }

  ngOnInit(): void {
  }

  viewGroup () {
    this.router.navigate(['/groups', this.group.id]);
  }

  joinGroup () {
    if (!this.Auth.loggedIn$.value) {
      const loginDialog = this.dialog.open(LoginDialogComponent);
      loginDialog.afterClosed().subscribe(result => {
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
  }
}
