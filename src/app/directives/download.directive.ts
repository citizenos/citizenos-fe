import { Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[download]'
})
export class DownloadDirective {

  constructor(private elem: ElementRef) {
  }

  ngAfterViewInit() {
    this.elem.nativeElement.addEventListener('click', this.linkClickHandler.bind(this));
  }

  linkClickHandler(e: MouseEvent) {
    const element = e.target as HTMLLinkElement;
    if (element.href)
      window.open(element.href, '_blank')
  }
}
