import { Component, Input } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogService } from 'src/app/shared/dialog';
import { take } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  @Input() redirectSuccess?: any;
  @Input() email?: string;
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
  constructor(private dialog: DialogService, ConfigService: ConfigService, private AuthService: AuthService, private Notification: NotificationService, private router: Router) {
    this.config = ConfigService.get('legal');
    this.termsVersion = this.config.version;
  }

  ngOnInit(): void {
    if (this.email) {
      this.signUpForm.patchValue({'email': this.email});
    }
  }

  agreeToTerms () {
    this.signUpForm.controls['agreeToTerms'].setValue(!this.signUpForm.value.agreeToTerms);
  }

  allowSearch () {
    this.signUpForm.controls['showInSearch'].setValue(!this.signUpForm.value.showInSearch);
  }

  doSignUp() {
    const formData = this.signUpForm.value;
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
            } else if (this.redirectSuccess) {
              window.location.href = this.redirectSuccess;
            } else {
              this.router.navigate(['/']);
            }
            setTimeout(() => {
              this.Notification.addInfo('MSG_INFO_CHECK_EMAIL_TO_VERIFY_YOUR_ACCOUNT');
            });
          },
          error: (res) => {
            if (res.errors.password) this.Notification.removeAll();
            this.errors = res.errors;
          }
        })
    }
  };
}
