import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/core/components/home/home.component';
import { AuthGuard, AuthGuardLogin } from '../auth/auth.guard';
import { AccountComponent } from './account.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordForgotComponent } from './components/password-forgot/password-forgot.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SmartIdLoginComponent } from './components/smart-id-login/smart-id-login.component';
import { EstIdLoginComponent } from './components/est-id-login/est-id-login.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: ProfileComponent },
  {
    path: '', canActivate: [AuthGuardLogin], component: AccountComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: 'login/smartid', component: SmartIdLoginComponent },
      { path: 'login/estid', component: EstIdLoginComponent },
      { path: 'signup', component: RegisterComponent },
      { path: 'password/forgot', component: PasswordForgotComponent },
      { path: 'password/reset/:passwordResetCode', component: PasswordResetComponent },
    ]
  },
  /* {
     path: '', component: HomeComponent, children: [
       { path: 'login', component: LoginComponent },
       { path: 'signup', component: RegisterComponent },
       { path: 'password/reset/:passwordResetCode', component: PasswordResetDialogComponent },
       { path: 'signup', component: RegisterComponent }
     ]
   },*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
