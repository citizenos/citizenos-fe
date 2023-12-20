import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddEmailComponent } from './components/add-email/add-email.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AddEidComponent } from './components/add-eid/add-eid.component';
import { ConnectEidComponent } from './components/connect-eid/connect-eid.component';
import { ConnectSmartIdComponent } from './components/connect-smart-id/connect-smart-id.component';
import { PasswordResetComponent, PasswordResetDialogComponent } from './components/password-reset/password-reset.component';
import { PasswordResetFormComponent } from './components/password-reset-form/password-reset-form.component';
import { PasswordForgotComponent } from './components/password-forgot/password-forgot.component';
import { SmartIdLoginComponent, SmartIdLoginDialogComponent } from './components/smart-id-login/smart-id-login.component';
import { RegisterComponent, RegisterDialogComponent } from './components/register/register.component';
import { LoginComponent, LoginDialogComponent } from './components/login/login.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { PasswordForgotFormComponent } from './components/password-forgot-form/password-forgot-form.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SmartIdLoginFormComponent } from './components/smart-id-login-form/smart-id-login-form.component';
import { EstIdLoginComponent, EstIdLoginDialogComponent} from './components/est-id-login/est-id-login.component';
import { EstIdLoginFormComponent } from './components/est-id-login-form/est-id-login-form.component';

@NgModule({
  declarations: [
    AccountComponent,
    AddEmailComponent,
    PrivacyPolicyComponent,
    AddEidComponent,
    ConnectEidComponent,
    ConnectSmartIdComponent,
    PasswordResetComponent,
    PasswordForgotComponent,
    LoginComponent,
    LoginDialogComponent,
    SmartIdLoginComponent,
    SmartIdLoginDialogComponent,
    RegisterComponent,
    RegisterDialogComponent,
    PasswordResetDialogComponent,
    LoginFormComponent,
    RegisterFormComponent,
    PasswordForgotFormComponent,
    ProfileComponent,
    PasswordResetFormComponent,
    SmartIdLoginFormComponent,
    EstIdLoginComponent,
    EstIdLoginDialogComponent,
    EstIdLoginFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
