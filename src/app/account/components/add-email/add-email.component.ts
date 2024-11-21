import { AuthService } from '@services/auth.service';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { NotificationService } from '@services/notification.service';
import { DialogService, DIALOG_DATA, DialogRef } from '@shared/dialog';
import { take } from 'rxjs';
import { User } from '@interfaces/user';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

export interface AddEmailData {
  user: User
}
@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.scss']
})
export class AddEmailComponent {
  user!: User;
  form = new UntypedFormGroup({
    email: new UntypedFormControl('', Validators.email),
  });
  errors?: any;
  wWidth = window.innerWidth;
  constructor(@Inject(DIALOG_DATA) private readonly data: AddEmailData,
    @Inject(DialogRef<AddEmailComponent>) private readonly emailDialog: DialogRef<AddEmailComponent> ,
    private readonly dialog: DialogService,
    private readonly AuthService: AuthService,
    private readonly Notification: NotificationService,
    @Inject(Router) private readonly router: Router,
    private readonly UserService: UserService) {
    this.user = data.user;
  }

  doUpdateProfile() {
    this.errors = null;

    if (this.form.value.email) {
      this.UserService
        .update(this.user.name, this.form.value.email)
        .pipe(take(1))
        .subscribe((userData) => {
          this.Notification.addInfo('MSG_INFO_CHECK_EMAIL_TO_VERIFY_YOUR_NEW_EMAIL_ADDRESS');
          this.emailDialog.close(true);
          this.dialog.closeAll();
        });
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
        this.emailDialog.close(false);
        this.dialog.closeAll();
        this.router.navigate(['account', 'login']);
      });
  }
}
