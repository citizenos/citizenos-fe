import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfigService } from 'src/app/services/config.service';
import { ConnectEidComponent } from '../connect-eid/connect-eid.component';
import { ConnectSmartIdComponent } from '../connect-smart-id/connect-smart-id.component';

@Component({
  selector: 'app-add-eid',
  templateUrl: './add-eid.component.html',
  styleUrls: ['./add-eid.component.scss']
})
export class AddEidComponent implements OnInit {
  authMethodsAvailable = this.ConfigService.get('features').authentication;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private dialog: MatDialog, private ConfigService: ConfigService) { }

  ngOnInit(): void {
  }

  /**
   * Login with Estonian ID-Card
   */
  doConnectEsteId() {
    this.dialog.open(ConnectEidComponent);
  };

  /**
   * Login with Smart-ID
   */
  doConnectSmartId() {
    this.dialog.open(ConnectSmartIdComponent);
  };

}
