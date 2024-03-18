import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTopicsComponent } from './my-topics.component';

const routes: Routes = [
  {
    path: '', data: {name: 'myTopicsView'}, component: MyTopicsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTopicsRoutingModule {
  constructor() {
  }
}
