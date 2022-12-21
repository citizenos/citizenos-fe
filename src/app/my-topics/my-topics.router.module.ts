import { MyTopicComponent } from './components/my-topic/my-topic.component';
import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes, UrlSegment } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { MyTopicsComponent } from './my-topics.component';

const routes: Routes = [
  {path: '', children: [
    {path: ':topicId', component: MyTopicsComponent, children: [
      {path: '', outlet:"mytopicsright", component: MyTopicComponent},
    ]},
    {path: '', component: MyTopicsComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTopicsRoutingModule {
  constructor (Router: Router) {
    console.log(Router.config[0])
  }
}
