import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupSettingsComponent } from '../group-settings/group-settings.component';

@Component({
  selector: 'group-settings-dialog',
  template: '<ng-component></ng-component>',
  styleUrls: ['./group-settings-dialog.component.scss']
})
export class GroupSettingsDialogComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    const settingsDialog = this.dialog.open(GroupSettingsComponent);
    settingsDialog.afterClosed().subscribe(result => {
      console.log(result)
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

}
