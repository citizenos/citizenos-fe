import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login.component';

@Component({
  template: ''
})
export class LoginDialogComponent {
  constructor(private dialog: MatDialog, private router: Router) {
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.router.navigate([':lang']);
    });
  }
}