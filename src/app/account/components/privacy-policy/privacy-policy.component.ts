import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  config: any;
  constructor(private dialog: MatDialog, private ConfigService: ConfigService, private AuthService: AuthService, private UserService: UserService) {
    this.config = ConfigService.get('legal');
  }

  ngOnInit(): void {
  }

  reject() {
    const confirmReject = this.dialog.open(ConfirmDialogComponent)
    confirmReject.afterClosed().subscribe((confirm) => {
      if (confirm === true) {
        this.UserService.deleteUser().pipe(take(1)).subscribe(

        )
      }
    })
    /*const data = angular.extend({}, this.$stateParams);
    this.ngDialog.openConfirm({
            template: '/views/modals/user_delete_confirm.html',
            data: data,
            closeByEscape: false,
            closeByNavigation: false
        })
        .then(() => {
            this.sUser
                .deleteUser()
                .then(() => {
                    return this.sAuth.logout();
                })
                .then(() => {
                    this.$window.location.href = '/';
                });
            }
        );*/

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
                /*
                                            if (filtered.length) {
                                                this.$window.location.href = this.$stateParams.redirectSuccess || '/';
                                            } else if (this.$window.navigator.languages.indexOf('et') > -1) {
                                                const dialog = this.ngDialog.open({
                                                    template: '/views/modals/add_eid.html'
                                                });

                                                dialog.closePromise.then(() => {
                                                    this.$window.location.href = this.$stateParams.redirectSuccess || '/';;
                                                });
                                            } else {
                                                this.ngDialog.closeAll();
                                                this.$window.location.href = this.$stateParams.redirectSuccess || '/';;
                                            }*/
              });
          })

      });

  };
}
