import { Component } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  config: any;
  signUpForm = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', Validators.email),
    company: new UntypedFormControl(''),
    password: new UntypedFormControl('', Validators.required),
    passwordConfirm: new UntypedFormControl('', Validators.required),
    agreeToTerms: new UntypedFormControl(false, Validators.requiredTrue),
    showInSearch: new UntypedFormControl(false)
  })

  isInviteFlowSignUp = false;
  wWidth = window.innerWidth;
  errors = <any>{};
  termsVersion: number;
  redirectSuccess?:string = '';
  constructor(private dialog: MatDialog, ConfigService: ConfigService, private AuthService: AuthService, private Notification: NotificationService) {
    this.config = ConfigService.get('legal');
    this.termsVersion = this.config.termsVersion;
    /*if (data.email) {
      this.signUpForm.patchValue({'email': data.email});
    }
    if (data.redirectSuccess) {
      this.redirectSuccess = data.redirectSuccess;
    }*/
  }

  ngOnInit(): void {
  }

  doSignUp() {
    const formData = this.signUpForm.value;
    console.log('signup', formData);
    if (!formData.agreeToTerms) {
      this.errors = {
        terms: 'MSG_ERROR_NEED_TO_AGREE_TERMS'
      }
      return;
    }

    if (formData.password && formData.password !== formData.passwordConfirm) {
      this.errors = {
        password: 'MSG_ERROR_PASSWORD_MISMATCH'
      };
      return;
    } else {
      this.AuthService
        .signUp({
          email:formData.email,
          password: formData.password,
          name: formData.name,
          company: formData.company,
          redirectSuccess: this.redirectSuccess,
          preferences: {
            showInSearch: formData.showInSearch
          },
          termsVersion: this.termsVersion
        }).pipe(take(1))
        .subscribe({
          next: (response:any) => {
            this.dialog.closeAll(); // Close all dialogs, including the one open now...
            if (response.data && response.redirectSuccess) {
              window.location.href = response.redirectSuccess;
            } else {
              this.Notification.addInfo('MSG_INFO_CHECK_EMAIL_TO_VERIFY_YOUR_ACCOUNT');
            }
          },
          error: (res) => {
            this.errors = res.errors;
          }
        })
    }
  };
}
