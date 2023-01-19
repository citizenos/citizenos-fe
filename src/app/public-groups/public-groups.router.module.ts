import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './components/groups/groups.component';

const routes: Routes = [
  {path: '', children: [
    {path: ':groupId'},
    {path: '', component: GroupsComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicGroupsRoutingModule {
  constructor () {
  }
}
