import { Directive, Input, OnDestroy, HostListener } from '@angular/core';

@Directive({
  selector: '[socialshare]'
})
export class SocialshareDirective implements OnDestroy {
  @Input() shareprovider: string = '';
  @Input() sharetext: string = '';
  @Input() shareurl: string = '';
  popupHeight = 600;
  popupWidth = 500;

  @HostListener('click', ['$event'])
  onClick(e: any) {
    switch (this.shareprovider) {
      case 'facebook':
        this.facebookShare();
        break;
      case 'twitter':
        this.twitterShare();
        break;
      case 'linkedin':
        this.linkedinShare();
        break;
    }
  }

  constructor() {
  }
  ngOnDestroy(): void {
  }

  facebookShare() {
    let urlString = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.shareurl || window.location.href);

    this.showSharePopup('Facebook', urlString);
  }

  twitterShare() {
    let urlString = 'https://www.twitter.com/intent/tweet?';

    if (this.sharetext) {
      urlString += 'text=' + encodeURIComponent(this.sharetext);
    }

    //default to the current page if a URL isn't specified
    urlString += '&url=' + encodeURIComponent(this.shareurl || window.location.href);

    this.showSharePopup('Twitter', urlString);
  }

  linkedinShare() {
    /*
    * Refer: https://developer.linkedin.com/docs/share-on-linkedin
    * Tab: Customized URL
    */
    let urlString = 'https://www.linkedin.com/shareArticle?mini=true';

    urlString += '&url=' + encodeURIComponent(this.shareurl || window.location.href);

    if (this.sharetext) {
      urlString += '&title=' + encodeURIComponent(this.sharetext);
    }
    this.showSharePopup('Linkedin', urlString);
  }

  showSharePopup(title: string, url: string) {
    window.open(
      url,
      title, 'toolbar=0,status=0,resizable=yes,width=' + this.popupWidth + ',height=' + this.popupHeight
      + ',top=' + (window.innerHeight - this.popupHeight) / 2 + ',left=' + (window.innerWidth - this.popupWidth) / 2);
  }
}
