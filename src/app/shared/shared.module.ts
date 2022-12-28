import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicboxComponent } from '../public-topics/components/topicbox/topicbox.component';
import { PublicgroupboxComponent } from '../public-groups/components/publicgroupbox/publicgroupbox.component';



@NgModule({
  declarations: [
    TopicboxComponent,
    PublicgroupboxComponent,
  ],
  imports: [
    CommonModule
  ],
   exports: [
    TopicboxComponent,
    PublicgroupboxComponent,
   ]
})
export class SharedModule { }
