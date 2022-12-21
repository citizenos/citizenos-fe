import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes, UrlSegment } from '@angular/router';

const routes: Routes = [
  {path: '', children: [
    {path: ':groupId'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicGroupsRoutingModule {
  constructor (router: Router) {
  }
}
