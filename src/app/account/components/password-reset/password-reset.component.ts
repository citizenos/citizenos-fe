import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UntypedFormGroup, UntypedFormControl, FormArray, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  resetForm = new UntypedFormGroup({
    password: new UntypedFormControl(),
    passwordConfirm: new UntypedFormControl(),
    email: new UntypedFormControl(),
    passwordResetCode: new UntypedFormControl()
  });

  errors: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private AuthService: AuthService, private Notification: NotificationService, private router: Router) {
    this.resetForm.patchValue({
      email: data.email,
      passwordResetCode: data.passwordResetCode
    });
  }

  ngOnInit(): void {
  }

  doPasswordReset() {
    console.log(this.resetForm.value)
    const formValue = this.resetForm.value;
    this.errors = null;

    if (formValue.password && formValue.password !== formValue.passwordConfirm) {
      this.errors = {
        password: 'MSG_ERROR_PASSWORD_MISMATCH'
      };
      return;
    }

    this.AuthService
      .passwordReset(formValue)
      .pipe(take(1))
      .subscribe({
        next: () => {
          //redirect login
          this.router.navigate(['/account/login'], {queryParams: {email: formValue.email}});
          this.Notification.addInfo('MSG_INFO_PASSWORD_RESET_SUCCESS');
        },
        error: (res: any) => {
          if (res.errors) { // Field errors
            this.errors = res.errors;
          }
        }
      });
  };
}


@Component({
  selector: 'app-password-reset-dialog',
  template: ''
})
export class PasswordResetDialogComponent implements OnInit {

  constructor(dialog: MatDialog, route: ActivatedRoute) {
    dialog.open(PasswordResetComponent, {
      data: {
        email: route.snapshot.queryParams['email'],
        passwordResetCode: route.snapshot.params['passwordResetCode']
      }
    })
  }

  ngOnInit(): void {
  }

}