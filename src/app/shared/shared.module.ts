import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicboxComponent } from '../public-topics/components/topicbox/topicbox.component';
import { PublicgroupboxComponent } from '../public-groups/components/publicgroupbox/publicgroupbox.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from '../directives/tooltip';
import { CosDropdownDirective } from '../directives/cos-dropdown.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from '../app-routing.module';
@NgModule({
  declarations: [
    TopicboxComponent,
    TooltipDirective,
    CosDropdownDirective,
    PublicgroupboxComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule
  ],
   exports: [
    TopicboxComponent,
    TooltipDirective,
    CosDropdownDirective,
    PublicgroupboxComponent,
    ConfirmDialogComponent
   ]
})
export class SharedModule { }
