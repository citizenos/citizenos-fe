import { MyTopicComponent } from './components/my-topic/my-topic.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { MyTopicsComponent } from './my-topics.component';

const routes: Routes = [
  {path: '', component: MyTopicsComponent},
  {path: ':topicId', component: MyTopicsComponent, children: [
    {path: '', outlet:"mytopicsright", component: MyTopicComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTopicsRoutingModule {
  constructor () {
  }
}
