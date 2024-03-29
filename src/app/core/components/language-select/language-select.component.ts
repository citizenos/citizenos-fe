import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/services/config.service';
import { Router, PRIMARY_OUTLET } from '@angular/router';
import { DialogRef } from 'src/app/shared/dialog';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})
export class LanguageSelectComponent implements OnInit {
  languages$: { [key: string]: any } = this.config.get('language').list;
  constructor(public translate: TranslateService, public config: ConfigService, private router: Router, private dialogRef: DialogRef<LanguageSelectComponent>,) {
  }

  ngOnInit(): void {
  }

  doSwitchLanguage(lang: string) {
    this.translate.use(lang);
    const parsedUrl = this.router.parseUrl(this.router.url);
    const outlet = parsedUrl.root.children[PRIMARY_OUTLET];

    let g = outlet?.segments.map(seg => seg.path) || [''];
    g.splice(0, 1);
    this.router.navigate(g, { queryParams: parsedUrl.queryParams, fragment: parsedUrl.fragment || undefined });
    this.dialogRef.close();
  }
}
