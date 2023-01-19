import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyGroupsRoutingModule } from './my-groups.router.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { MyGroupsComponent } from './my-groups.component';
import { GroupListComponent } from './components/group-list/group-list.component';

@NgModule({
  declarations: [
    MyGroupsComponent,
    GroupListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MyGroupsRoutingModule,
    TranslateModule
  ]
})
export class MyGroupsModule { }
