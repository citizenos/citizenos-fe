import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyGroupsRoutingModule } from './my-groups.router.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { MyGroupsComponent } from './my-groups.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MyGroupsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MyGroupsRoutingModule,
    TranslateModule
  ]
})
export class MyGroupsModule { }
