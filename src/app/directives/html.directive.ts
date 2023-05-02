import { Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[htmlwrap]'
})
export class HtmlDirective {
  constructor(private wrapper: ElementRef) {
  }

  ngAfterViewInit() {
    if (this.wrapper) {
      const links = this.wrapper.nativeElement.querySelectorAll('a');
      links.forEach((link:any) => {
        link.addEventListener('click', this.linkClickHandler.bind(this));
      });
    }
  }

  linkClickHandler(e: MouseEvent) {
    const element = e.target as HTMLLinkElement;
    if (element.href)
      window.open(element.href, '_blank')
  }
}
