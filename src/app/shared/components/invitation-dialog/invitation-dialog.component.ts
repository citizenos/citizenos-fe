import { Component, Inject } from '@angular/core';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ConfigService } from '@services/config.service';
import { InviteDialogData } from '@interfaces/dialogdata';

@Component({
  selector: 'app-invitation-dialog',
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.scss'],
})
export class InvitationDialogComponent {
  dialogData: InviteDialogData;
  config = this.ConfigService.get('links');
  constructor(
    private ConfigService: ConfigService,
    private dialog: DialogService,
    @Inject(DIALOG_DATA) private data: InviteDialogData,
    private Auth: AuthService,
    private router: Router
  ) {
    this.dialogData = this.data;
  }

  goToPublicUrl(link: string[]) {
    this.dialog.closeAll();
    this.router.navigate(link);
  }

  get loggedIn() {
    return this.Auth.loggedIn$.value;
  }
}
