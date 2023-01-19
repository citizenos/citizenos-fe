import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsComponent } from './components/groups/groups.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { PublicGroupsRoutingModule } from './public-groups.router.module';



@NgModule({
  declarations: [
    GroupsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PublicGroupsRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class PublicGroupsModule { }
