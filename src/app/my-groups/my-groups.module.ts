import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyGroupsRoutingModule } from './my-groups.router.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    MyGroupsRoutingModule,
    TranslateModule
  ]
})
export class MyGroupsModule { }
