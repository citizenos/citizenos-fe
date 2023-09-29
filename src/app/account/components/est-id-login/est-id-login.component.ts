import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-est-id-login',
  templateUrl: './est-id-login.component.html',
  styleUrls: ['./est-id-login.component.scss']
})

export class EstIdLoginComponent {

}

@Component({
  templateUrl: './est-id-login-dialog.component.html',
  styleUrls: ['./est-id-login-dialog.component.scss']
})
export class EstIdLoginDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data:any) {
    console.log(data);
  }
}
