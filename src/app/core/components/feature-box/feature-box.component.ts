import { Router } from '@angular/router';
import { Component, Input, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '@services/location.service';
import { AuthService } from '@services/auth.service';
import { AppService } from '@services/app.service';

@Component({
  selector: 'feature-box',
  templateUrl: './feature-box.component.html',
  styleUrls: ['./feature-box.component.scss']
})
export class FeatureBoxComponent {
  @Input() feature!: string;
  @Input() items!: number;
  @Input() icon!: string;

  private app = inject(AppService);
  private auth = inject(AuthService);
  private Location = inject(LocationService);

  router = inject(Router);
  translate = inject(TranslateService);

  itemsList() {
    let items = [];
    let i = 0;
    while (i < this.items) {
      items.push(i);
      i++;
    }
    return items;
  }

  btnClick() {
    let urlPath: string[] = [];
    switch (this.feature) {
      case 'discussion':
        urlPath = ['/', this.translate.currentLang, 'topics', 'create'];
        break;
      case 'voting':
        urlPath = ['/', this.translate.currentLang, 'topics', 'vote', 'create'];
        break;
      case 'ideation':

        urlPath = ['/', this.translate.currentLang, 'topics', 'ideation', 'create'];
        break;
    }

    if (!this.auth.loggedIn$.value) {
      const tree = this.router.createUrlTree(urlPath);
      const treeSerialize = this.router.serializeUrl(tree).toString();
      const redirectSuccess = this.Location.getAbsoluteUrl(treeSerialize);
      return this.app.doShowLogin(redirectSuccess);
    }
    this.router.navigate(urlPath)
  }
}
