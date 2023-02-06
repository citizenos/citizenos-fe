import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.scss']
})
export class AddEmailComponent implements OnInit {
  email?: string;
  errors?: any;
  wWidth = window.innerWidth;
  constructor(private dialog: MatDialog, private AuthService: AuthService, private Notification: NotificationService, private UserService: UserService) { }

  ngOnInit(): void {
  }

  doUpdateProfile() {
    this.errors = null;

  /*  const success = (res) => {
      // E-mail address was changed!
      this.$cookies.remove('addEmailInProgress');
    //  angular.extend(this.sAuth.user, res.data.data);
      this.Notification.addInfo('MSG_INFO_CHECK_EMAIL_TO_VERIFY_YOUR_NEW_EMAIL_ADDRESS');
     // this.sAuth.user.loggedIn = true;
      this.dialog.closeAll(); // Close all dialogs, including the one open now...
    };*/
/*
    const error = (res) => {
      this.errors = res.data.errors;
    };*/

    if (this.email) {
      this.UserService
        .update(undefined, this.email)
        .pipe(take(1))
        .subscribe((userData) => {
          console.log(userData);
        })
  //      .then(success, error);
    } else {
      this.errors = { email: 'MODALS.ADD_EMAIL_ERROR_MSG_INVALID' }
    }

  }

  logout() {
    this.AuthService
      .logout()
      .pipe(
        take(1)
      )
      .subscribe(() => {
        // Reload because the sAuthResolve would not update on logout causing the login screen to redirect to "home" thinking User is logged in
    //    this.$state.go('account/login');
      });
  }
}
