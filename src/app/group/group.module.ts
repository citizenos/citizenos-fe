import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { GroupComponent } from './group.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { GroupCreateComponent } from './components/group-create/group-create.component';


@NgModule({
  declarations: [
    GroupComponent,
    GroupCreateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    GroupRoutingModule,
    FormsModule
  ]
})
export class GroupModule { }
