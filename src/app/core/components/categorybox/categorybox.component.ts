import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-categorybox',
  templateUrl: './categorybox.component.html',
  styleUrls: ['./categorybox.component.scss']
})
export class CategoryboxComponent implements OnInit {
  categoryBoxes = [
    {
      link: '/citizenos',
      class: 'tutorial white_text blue_background',
      topText: 'VIEWS.HOME.HEADING_BEGINNERS_GUIDE',
      title: 'VIEWS.HOME.TXT_BEGINNERS_GUIDE',
      description: '',
      footer: 'VIEWS.HOME.LBL_TUTORIAL_AND_EXPLANATION'
    },
    {
      link: '/citizenos',
      class: 'citizenos',
      topText: 'VIEWS.HOME.HEADING_CITIZENOS_COMMUNITY',
      title: 'VIEWS.HOME.TXT_CITIZENOS_COMMUNITY',
      description: 'VIEWS.HOME.TXT_CITIZENOS_COMMUNITY_DESCRIPTION',
      footer: 'VIEWS.HOME.LBL_CITIZENOS_COMMUNITY'
    },
    {
      link: '/eurochangemakers',
      class: 'eurochangemakers white_text',
      topText: 'GEYC',
      title: 'EuroChangeMakers',
      description: 'EuroChangeMakers #euroCM Project, co-funded by Europe for Citizens Programme of the European Union, engages 19 partners from 18 countries and aims to foster youth participation and reflection on critical issues for the Future of Europe: digitalization, social cohesion, and environment. https://eurocm.geyc.ro',
      footer: 'EuroChangeMakers'
    },
    {
      link: '/biotoopia',
      class: 'biotoopia white_text',
      topText: '26-28 August International Hybrid Conference in Viinistu Art Harbour in Estonia',
      title: 'Biotoopia',
      description: 'Biotoopia is searching for fresh modes of cooperation between the arts, sciences and biosphere, to prepare the ground for the germination of new thought patterns. Join us in a warm-up online discussion “The renaissance of bioharmony is here!” which culminates with live panel session on 20.08 at 16.00 - 17.30 (UTC +03).',
      footer: this.sanitizer.bypassSecurityTrustHtml('<span (click)="goToPage(\'https://biotoopia.ee/\'); $event.preventDefault();">Biotoopia</span>')
    },
    {
      link: '/hacktivistcommunity',
      class: 'hacktivist_community black_text',
      topText: 'VIEWS.HOME.HEADING_HACKTIVIST_COMMUNITY',
      title: 'VIEWS.HOME.TXT_HACKTIVIST_COMMUNITY',
      description: 'VIEWS.HOME.TXT_DESCRIPTION_HACKTIVIST_COMMUNITY',
      footer: 'VIEWS.HOME.LBL_HACKTIVIST_COMMUNITY'
    },
    {
      link: '/thirtyfourislandproject',
      class: 'thirty_four_island_project black_text',
      topText: 'VIEWS.HOME.HEADING_LETS_DO_IT_WORLD',
      title: '34 island project oleh Let\'s Do It Indonesia',
      description: '34 island project bersifat terbuka bagi seluruh pihak, baik masyarakat, organisasi, dan pemerintah di Indonesia dengan tujuan menampung ide untuk mengimplementasikan rencana lingkungan yang berkelanjutan dalam Keep It Clean plan di Indonesia.',
      footer: '34 island project'
    },
    {
      link: '/opinionfestival',
      class: 'opinionfestival black_text',
      topText: 'Citizen OS Indonesia',
      title: 'Indonesian Opinion Festival',
      description: 'Indonesia Opinion Festival adalah even yang mempertemukan masyarakat untuk merayakan kebebasan berpendapat. Diskusi, debat, rekomendasi ide dan voting terhadap ide-ide terpilih dalam perjalanan menuju e-democracy bangsa.',
      footer: 'Opinion Festival'
    },
    {
      link: '/pyln',
      class: 'pyln black_text',
      topText: 'Citizen OS India',
      title: 'Participatory Youth Leadership Network',
      description: 'PYLN is a community of practice for youth organisations to hack participatory leadership in India',
      footer: 'Participatory Youth Leadership Network'
    }
  ];

  constructor(private sanitizer: DomSanitizer, private translate: TranslateService) {
  }

  ngOnInit(): void {
    console.log(this.translate);
  }

  resolveFooter (footer: any) {
    if (typeof footer === 'string') {
      return this.translate.instant(footer);
    }
    return footer;
  }
  showTextSmall () {
    return window.innerWidth > 667;
  }
}
