import { Component, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms'
import { DialogService } from 'src/app/shared/dialog';

@Component({
  selector: 'password-reset-form',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.scss']
})
export class PasswordResetFormComponent {
  @Input() modal?:boolean;
  resetForm = new UntypedFormGroup({
    password: new UntypedFormControl(),
    passwordConfirm: new UntypedFormControl(),
    email: new UntypedFormControl(),
    passwordResetCode: new UntypedFormControl()
  });

  errors: any = {};
  constructor(private AuthService: AuthService, private route: ActivatedRoute, private Notification: NotificationService, private router: Router, private dialog:DialogService) {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;
    this.resetForm.patchValue({
      email: queryParams['email'],
      passwordResetCode: params['passwordResetCode']
    });
  }

  ngOnInit(): void {
  }

  doPasswordReset() {
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

  cancel () {
    if (this.modal) {
      this.dialog.closeAll();
    }
  }
}
