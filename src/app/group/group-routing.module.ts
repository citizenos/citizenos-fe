import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupComponent } from './group.component';

const routes: Routes = [
  {path: '', children: [
    {path: ':groupId', component: GroupComponent, children: [
      {path: '', component: GroupComponent},
    ]},
    {path: '', component: GroupComponent},
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
