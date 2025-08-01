import { AuthService } from '@services/auth.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '@services/config.service';
import { Router, PRIMARY_OUTLET } from '@angular/router';
import { DialogRef } from 'src/app/shared/dialog';
import { UserService } from '@services/user.service';
import { take } from 'rxjs';

@Component({
  selector: 'language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss'],
  standalone: false
})
export class LanguageSelectComponent implements OnInit {
  languages$: { [key: string]: any } = this.config.get('language').list;
  constructor(
    public translate: TranslateService,
    public config: ConfigService,
    private router: Router,
    private dialogRef: DialogRef<LanguageSelectComponent>,
    private AuthService: AuthService,
    private User: UserService) {
  }

  ngOnInit(): void {
  }

  doSwitchLanguage(lang: string) {
    this.translate.use(lang);
    const parsedUrl = this.router.parseUrl(this.router.url);
    const outlet = parsedUrl.root.children[PRIMARY_OUTLET];

    let g = outlet?.segments.map(seg => seg.path) || [''];
    g[0] = lang;
    if (this.AuthService.loggedIn$.value) {
      this.User.updateLanguage(lang).pipe(take(1)).subscribe();
    }
    this.router.navigate(g, { queryParams: parsedUrl.queryParams, fragment: parsedUrl.fragment || undefined, skipLocationChange: false });
    this.dialogRef.close();
  }
}
