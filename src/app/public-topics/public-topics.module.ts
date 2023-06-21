import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsComponent } from './components/topics/topics.component';
import { TranslateModule } from '@ngx-translate/core';
import { PublicTopicsRoutingModule } from './public-topics.router.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TopicsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    PublicTopicsRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class PublicTopicsModule { }
