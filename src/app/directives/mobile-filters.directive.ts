import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mobileFilters]'
})
export class MobileFiltersDirective {
  isOpen = false;
  constructor(private elem: ElementRef, private renderer: Renderer2) {
  }
  @HostListener('click')
  onClick() {
    const elem = this.elem.nativeElement;
    if (elem.classList.contains('active')) {
      this.renderer.removeClass(elem, 'active');
    } else {
      this.renderer.addClass(elem, 'active');
    }
  }
  @HostListener('document:click', ['$event'])
  clickout() {
    const elem = this.elem.nativeElement;
    if (!elem.classList.contains('active_recent')) {
      this.renderer.removeClass(elem, 'dropdown_active');
    }

    this.renderer.removeClass(elem, 'active_recent');
  }
}
