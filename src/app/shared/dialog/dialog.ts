import { NgModule } from '@angular/core';
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
  ],
  bootstrap: [
    DialogRef
  ]
})
export class DialogModule { }
