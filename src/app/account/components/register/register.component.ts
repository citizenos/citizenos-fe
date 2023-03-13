import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  config: any;
  signUpForm = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', Validators.email),
    company: new UntypedFormControl(''),
    password: new UntypedFormControl('', Validators.required),
    passwordConfirm: new UntypedFormControl('', Validators.required),
    agreeToTerms: new UntypedFormControl(false, Validators.requiredTrue)
  })

  isInviteFlowSignUp = false;
  wWidth = window.innerWidth;
  errors = <any>{};
  agreeToTerms = false;
  termsVersion: number;
  preferences = {
    showInSearch: false
  }
  redirectSuccess?:string = '';
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data: any, ConfigService: ConfigService, private AuthService: AuthService, private Notification: NotificationService) {
    this.config = ConfigService.get('legal');
    this.termsVersion = this.config.termsVersion;
    if (data.email) {
      this.signUpForm.patchValue({'email': data.email});
    }
    if (data.redirectSuccess) {
      this.redirectSuccess = data.redirectSuccess;
    }
  }

  ngOnInit(): void {
  }

  toggleTerms() {
    this.signUpForm.patchValue({agreeToTerms: this.agreeToTerms})
  }
  doSignUp() {
    const formData = this.signUpForm.value;
    if (!this.agreeToTerms) {
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
          preferences: this.preferences,
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
        //.then(success, error);
    }
  };

}

@Component({
  selector: 'app-register-dialog',
  template: '',
})
export class RegisterDialogComponent implements OnInit {

  constructor(dialog: MatDialog, route: ActivatedRoute, private router: Router) {
    const params = Object.assign({}, route.snapshot.params);
    const registerDialog = dialog.open(RegisterComponent, {
      data: Object.assign(params, {redirectSuccess: route.url})
    });
    registerDialog.afterClosed().subscribe(() => {
      this.router.navigate(['/']);
    })
  }

  ngOnInit(): void {
  }

}