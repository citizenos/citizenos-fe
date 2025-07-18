import { Component, Input } from '@angular/core';
import { ConfigService } from '@services/config.service';
import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/notification.service';
import { DialogService } from 'src/app/shared/dialog';
import { take } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VerifyEmailDialogComponent } from '../verify-email-dialog/verify-email-dialog.component';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  standalone: false
})
export class RegisterFormComponent {
  @Input() redirectSuccess?: any;
  @Input() email?: string;
  @Input() inviteId?: string;
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

  showPassword = false;
  showPasswordConfirm = false;
  isInviteFlowSignUp = false;
  wWidth = window.innerWidth;
  errors = <any>{};
  termsVersion: number;
  constructor(private dialog: DialogService, ConfigService: ConfigService, private AuthService: AuthService, private Notification: NotificationService, private router: Router) {
    this.config = ConfigService.get('legal');
    this.termsVersion = this.config.version;
  }

  ngOnInit(): void {
    if (this.email) {
      this.signUpForm.patchValue({ 'email': this.email });
    }
    if (this.inviteId) {
      this.isInviteFlowSignUp = true;
    }
  }

  agreeToTerms() {
    this.signUpForm.controls['agreeToTerms'].setValue(!this.signUpForm.value.agreeToTerms);
  }

  allowSearch() {
    this.signUpForm.controls['showInSearch'].setValue(!this.signUpForm.value.showInSearch);
  }

  doSignUp() {
    this.errors = {};
    const formData = this.signUpForm.value;
    if (!formData.agreeToTerms) {
      this.errors = {
        terms: 'MSG_ERROR_NEED_TO_AGREE_TERMS'
      }
    }

    if (formData.password && formData.password !== formData.passwordConfirm) {
      this.errors = Object.assign(this.errors,{
        password: 'MSG_ERROR_PASSWORD_MISMATCH'
      });
      return;
    }
    if (this.signUpForm.invalid) {
      return;
    }
    else {
      this.AuthService
        .signUp({
          email: formData.email,
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
          next: (response: any) => {
            let delay = 0;
            this.dialog.closeAll(); // Close all dialogs, including the one open now...
            if (!this.isInviteFlowSignUp) {
             // this.Notification.addInfo('MSG_INFO_CHECK_EMAIL_TO_VERIFY_YOUR_ACCOUNT');
              const verifyDialog = this.dialog.open(VerifyEmailDialogComponent, {
                data: {
                  email: formData.email
                }
              });
              verifyDialog.afterClosed().subscribe(() => {
                if (response.data && response.redirectSuccess) {
                  window.location.href = response.redirectSuccess;
                } else if (this.redirectSuccess) {
                  window.location.href = this.redirectSuccess;
                } else {
                  this.router.navigate(['/']);
                }
              });
            } else {
              setTimeout(() => {
                if (response.data && response.redirectSuccess) {
                  window.location.href = response.redirectSuccess;
                } else if (this.redirectSuccess) {
                  window.location.href = this.redirectSuccess;
                } else {
                  this.router.navigate(['/']);
                }
              }, 0);
            }
          },
          error: (res) => {
            if (res.errors.password) this.Notification.removeAll();
            this.errors = res.errors;
          }
        })
    }
  };
}
