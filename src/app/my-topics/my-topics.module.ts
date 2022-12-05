import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { MyTopicComponent } from './components/my-topic/my-topic.component';



@NgModule({
  declarations: [
    ListComponent,
    MyTopicComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MyTopicsModule { }
