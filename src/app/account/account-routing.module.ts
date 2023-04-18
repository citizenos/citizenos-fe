import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/core/components/home/home.component';
import { AuthGuard } from '../auth/auth.guard';
import { AccountComponent } from './account.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordResetDialogComponent } from './components/password-reset/password-reset.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordForgotComponent } from './components/password-forgot/password-forgot.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'password/forgot', component: PasswordForgotComponent },
  { path: '', canActivate: [AuthGuard], component: AccountComponent },
  {
    path: '', component: HomeComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: RegisterComponent },
      { path: 'password/reset/:passwordResetCode', component: PasswordResetDialogComponent },
      { path: 'signup', component: RegisterComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
