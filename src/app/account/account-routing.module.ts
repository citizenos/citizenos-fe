import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/core/components/home/home.component';
import { AuthGuard } from '../auth/auth.guard';
import { AccountComponent } from './account.component';
import { LoginComponent } from './components/login/login.component';
import { LoginDialogComponent } from './components/login/login.component';
import { PasswordResetDialogComponent } from './components/password-reset/password-reset.component';
import { RegisterDialogComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: '', canActivate: [AuthGuard], component: AccountComponent },
      { path: 'login', component: LoginDialogComponent },
      { path: 'signup', component: RegisterDialogComponent },
      { path: 'password/reset/:passwordResetCode', component: PasswordResetDialogComponent },
      { path: 'signup', component: RegisterDialogComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
