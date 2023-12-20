import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'password-forgot-form',
  templateUrl: './password-forgot-form.component.html',
  styleUrls: ['./password-forgot-form.component.scss']
})
export class PasswordForgotFormComponent {
  passwordForgotForm = new UntypedFormGroup({
    email: new UntypedFormControl('', Validators.email)
  });
  errors: any;

  constructor(private AuthService: AuthService, private Notification: NotificationService) { }

  ngOnInit(): void {
  }

  doPasswordReset() {
    this.errors = null;

    const success = () => {
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
