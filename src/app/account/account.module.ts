import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    AccountComponent,
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
