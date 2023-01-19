import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes, UrlSegment } from '@angular/router';
import { MyGroupsComponent } from './my-groups.component';

const routes: Routes = [
  {path: ':groupId', children: [
    {path: '', outlet:"mygroupsright", component: MyGroupsComponent},
  ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MyGroupsRoutingModule {
  constructor (router: Router) {
  }
}
