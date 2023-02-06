import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddEmailComponent } from './components/add-email/add-email.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
@NgModule({
  declarations: [
    AccountComponent,
    AddEmailComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
