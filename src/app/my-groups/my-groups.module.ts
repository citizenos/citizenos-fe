import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyGroupsRoutingModule } from './my-groups.router.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { MyGroupsComponent } from './my-groups.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { GroupListItemComponent } from './components/group-list-item/group-list-item.component';
import { MyGroupComponent } from './components/my-group/my-group.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MyGroupsComponent,
    GroupListComponent,
    GroupListItemComponent,
    MyGroupComponent
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
