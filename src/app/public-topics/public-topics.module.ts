import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { TopicsComponent } from './components/topics/topics.component';
import { TranslateModule } from '@ngx-translate/core';
import { PublicTopicsRoutingModule } from './public-topics.router.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    TopicsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PublicTopicsRoutingModule,
    TranslateModule,
    MatSelectModule
  ]
})
export class PublicTopicsModule { }
