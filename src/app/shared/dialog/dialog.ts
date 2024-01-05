import { NgModule } from '@angular/core';
import { DialogService } from './dialog.service';
import { DialogCloseDirective, DialogRef } from './dialog-ref';

@NgModule({
  declarations: [
    DialogCloseDirective
  ],
  imports: [
  ],
  exports: [
    DialogCloseDirective
  ],
  providers: [
    DialogService
  ],
  bootstrap: [
    DialogRef
  ]
})
export class DialogModule { }
