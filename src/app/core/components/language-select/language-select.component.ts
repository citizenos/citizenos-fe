import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/services/config.service';
import { Router, PRIMARY_OUTLET } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})
export class LanguageSelectComponent implements OnInit {
  languages$: { [key: string]: any } = this.config.get('language').list;
  constructor(public translate: TranslateService, public config: ConfigService, private router: Router, private dialogRef: MatDialogRef<LanguageSelectComponent>,) {
  }

  ngOnInit(): void {
  }

  doSwitchLanguage(lang: string) {
    this.translate.use(lang);
    const parsedUrl = this.router.parseUrl(this.router.url);
    const outlet = parsedUrl.root.children[PRIMARY_OUTLET];

    const g = outlet?.segments.map(seg => seg.path) || [''];
    g[0] = lang;
    this.router.navigate(g, { queryParams: parsedUrl.queryParams, fragment: parsedUrl.fragment || undefined });
    this.dialogRef.close();
  }
}
