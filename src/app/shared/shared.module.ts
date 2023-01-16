import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicboxComponent } from '../public-topics/components/topicbox/topicbox.component';
import { PublicgroupboxComponent } from '../public-groups/components/publicgroupbox/publicgroupbox.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from '../directives/tooltip';
import { CosDropdownDirective } from '../directives/cos-dropdown.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { TypeaheadComponent, TypeaheadItem } from './components/typeahead/typeahead.component';
import { FormsModule } from '@angular/forms';
import { CosInitialsComponent } from './components/cos-initials/cos-initials.component';
import { MomentModule } from 'ngx-moment';
import { QRCodeModule } from 'angularx-qrcode';
import { CosPaginationComponent } from './components/cos-pagination/cos-pagination.component';
import { SocialshareDirective } from '../directives/socialshare.directive';
@NgModule({
  declarations: [
    ConfirmDialogComponent,
    CosDropdownDirective,
    CosInitialsComponent,
    CosPaginationComponent,
    PublicgroupboxComponent,
    SocialshareDirective,
    TooltipDirective,
    TopicboxComponent,
    TypeaheadComponent,
    TypeaheadItem,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MomentModule,
    QRCodeModule,
    TranslateModule,
  ],
   exports: [
    ConfirmDialogComponent,
    CosDropdownDirective,
    CosInitialsComponent,
    CosPaginationComponent,
    MatDialogModule,
    MomentModule,
    PublicgroupboxComponent,
    QRCodeModule,
    SocialshareDirective,
    TooltipDirective,
    TopicboxComponent,
    TypeaheadComponent,
    TypeaheadItem
   ]
})
export class SharedModule { }
