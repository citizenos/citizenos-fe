import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes, UrlSegment } from '@angular/router';

const routes: Routes = [
  {path: '', children: [
    {path: ':topicId'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicTopicsRoutingModule {
  constructor (router: Router) {
    console.log('public topics', router)
  }
}
