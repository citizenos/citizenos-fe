import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'password-forgot-form',
  templateUrl: './password-forgot-form.component.html',
  styleUrls: ['./password-forgot-form.component.scss'],
  standalone: false
})
export class PasswordForgotFormComponent {
  passwordForgotForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.email, Validators.required])
  });
  errors: any;

  constructor(private AuthService: AuthService, private Notification: NotificationService) { }

  ngOnInit(): void {
  }

  doPasswordReset() {
    if (this.passwordForgotForm.invalid || !this.passwordForgotForm.value['email']) return;
    const success = () => {
      this.passwordForgotForm.reset();
      this.Notification.removeAll();
      this.Notification.addInfo('MSG_INFO_PASSWORD_RECOVERY_EMAIL_SENT');
    };

    const error = (res: any) => {
      this.errors = res.errors;
    };

    this.AuthService
      .passwordResetSend(this.passwordForgotForm.value)
      .pipe(take(1))
      .subscribe({ next: success, error: error });
  };
}
