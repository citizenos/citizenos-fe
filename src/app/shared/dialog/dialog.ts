import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogCloseDirective, DialogRef } from './dialog-ref';

@NgModule({
  imports: [
    CommonModule,
    DialogCloseDirective
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
