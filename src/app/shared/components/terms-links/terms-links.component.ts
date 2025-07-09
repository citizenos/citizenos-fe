import { Component, Input } from '@angular/core';
import { ConfigService } from '@services/config.service';

interface ILink {
  title: string;
  href: string
}

@Component({
  selector: 'terms-links',
  templateUrl: './terms-links.component.html',
  styleUrls: ['./terms-links.component.scss'],
  standalone: false
})
export class TermsLinksComponent {
  @Input() withStatutLink?: boolean = true;

  config: Record<string, unknown> & {
    termsOfUse: string;
    privacyPolicy: string;
    statut: string;
  };
  links: ILink[] = []
  constructor(ConfigService: ConfigService) {
    this.config = ConfigService.get('legal');
  }

  ngOnInit() {
    this.links = [
      {
        title: "MODALS.PRIVACY_POLICY_LNK_TERMS_OF_USE",
        href: this.config.termsOfUse,
      },
      {
        title: "MODALS.PRIVACY_POLICY_LNK_PRIVACY_POLICY",
        href: this.config.privacyPolicy,
      },
      ...(this.withStatutLink ? [
        {
          title: "MODALS.PRIVACY_POLICY_LNK_ARTICLES_OF_ASSOCIATION",
          href: this.config.statut,
       }
      ] : [])
    ]
  }
}
