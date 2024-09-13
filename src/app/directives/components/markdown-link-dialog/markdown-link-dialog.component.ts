import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';

@Component({
  selector: 'markdown-link-dialog',
  templateUrl: './markdown-link-dialog.component.html',
  styleUrl: './markdown-link-dialog.component.scss'
})
export class MarkdownLinkDialogComponent {
  wWidth = window.innerWidth;
  form = new UntypedFormGroup({
    linktext: new UntypedFormControl('', Validators.nullValidator),
    link: new UntypedFormControl('', Validators.nullValidator)
  });

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    @Inject(DialogRef<MarkdownLinkDialogComponent>) private linkDialog: DialogRef<MarkdownLinkDialogComponent> ,
  ) {
    console.log(this.data);
    if (this.data.selected) {
      this.form.setValue({linktext: this.data.selected, link: ''})
    }
  }

  ngOnInit() {
    if (this.data.selected) {
      this.form.setValue({linktext: this.data.selected, link: ''})
    }
  }

  save () {
    this.linkDialog.close(this.form.value);
  }
}
