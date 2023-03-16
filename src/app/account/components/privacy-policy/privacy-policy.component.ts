import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AddEidComponent } from '../add-eid/add-eid.component';

export interface PrivacyPolicyData {
  user: User
}
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  config: any;
  user!: User;
  constructor(
    @Inject(MAT_DIALOG_DATA) data: PrivacyPolicyData,
    private dialog: MatDialog,
    ConfigService: ConfigService,
    private AuthService: AuthService,
    private UserService: UserService,
    private router: Router
  ) {
    this.config = ConfigService.get('legal');
    this.user = data.user;
  }

  ngOnInit(): void {
  }

  reject() {
    const confirmReject = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.USER_DELETE_CONFIRM_HEADING',
        title: 'MODALS.USER_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        description: 'MODALS.USER_DELETE_CONFIRM_TXT_NO_UNDO',
        points: ['MODALS.USER_DELETE_CONFIRM_TXT_USER_DELETED', 'MODALS.USER_DELETE_CONFIRM_TXT_KEEP_DATA_ANONYMOUSLY'],
        confirmBtn: 'MODALS.USER_DELETE_CONFIRM_YES',
        closeBtn: 'MODALS.USER_DELETE_CONFIRM_NO'
      }
    })
    confirmReject.afterClosed().subscribe((confirm) => {
      if (confirm === true) {
        this.UserService.deleteUser().pipe(take(1)).subscribe(() => {
          this.dialog.closeAll();
        })
      }
      this.AuthService.logout().pipe(take(1)).subscribe();
      this.router.navigate(['/']);
    });
  };

  accept() {
    this.UserService
      .updateTermsVersion(this.config.version)
      .pipe(take(1))
      .subscribe((data) => {
        this.AuthService.status().pipe(take(1))
          .subscribe((user) => {
            this.dialog.closeAll();
            this.UserService
              .listUserConnections(user.id)
              .pipe(take(1))
              .subscribe((connections) => {
                const filtered = connections.rows.filter((con: any) => {
                  return ['esteid', 'smartid'].indexOf(con.connectionId) > -1;
                });

                if (filtered.length) {
                    //this.$window.location.href = this.$stateParams.redirectSuccess || '/';
                    this.router.navigate(['/']);
                } else if (window.navigator.languages.indexOf('et') > -1) {
                    const addEidDialog = this.dialog.open(AddEidComponent, {
                      data: {
                        connections: connections
                      }
                    })


                    addEidDialog.afterClosed().subscribe(() => {
                        //this.$window.location.href = this.$stateParams.redirectSuccess || '/';;
                    });
                } else {
                  /*  this.ngDialog.closeAll();
                    this.$window.location.href = this.$stateParams.redirectSuccess || '/';;*/
                }
              });
          })

      });

  };
}
