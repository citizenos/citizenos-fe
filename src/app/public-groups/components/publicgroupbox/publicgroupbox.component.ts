import { AuthService } from '@services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog';
import { Router } from '@angular/router';

import { Group } from 'src/app/interfaces/group';
import { LocationService } from '@services/location.service';
import { LoginDialogComponent } from 'src/app/account/components/login/login.component';
import { GroupService } from '@services/group.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'public-group-box',
  templateUrl: './publicgroupbox.component.html',
  styleUrls: ['./publicgroupbox.component.scss'],
  standalone: false
})
export class PublicgroupboxComponent implements OnInit {
  @Input() group = <Group>{}; // decorate the property with @Input()
  constructor(
    private Location: LocationService,
    private dialog: DialogService,
    private GroupService: GroupService,
    private router: Router,
    private Auth: AuthService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {}

  viewGroup() {
    this.router.navigate(['/groups', this.group.id]);
  }

  generateJoinUrl() {
    if (this.group.join.token && this.GroupService.canShare(this.group)) {
      return ['/groups/join/', this.group.join.token];
    } else {
      return ['/groups/', this.group.id, '/join'];
    }
  }

  joinGroup() {
    if (!this.Auth.loggedIn$.value) {
      const urlPath = [this.translate.currentLang, 'groups', this.group.id]
      const tree = this.router.createUrlTree(urlPath);
      const treeSerialize = this.router.serializeUrl(tree).toString();
      const redirectSuccess = this.Location.getAbsoluteUrl(treeSerialize);

      const loginDialog = this.dialog.open(LoginDialogComponent, {
        data: { redirectSuccess: redirectSuccess },
      });
      loginDialog.afterClosed().subscribe((result) => {});
    } else {
      /**
       * @note Workaround to prevent creating a new dialog component.
       */
      this.router.navigate(this.generateJoinUrl());
    }
  }
}
