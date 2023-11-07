import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mobileFilters]'
})
export class MobileFiltersDirective {
  isOpen = false;
  constructor(private elem: ElementRef, private renderer: Renderer2) {
  }
  @HostListener('click', ['$event.target'])
  onClick(btn: any) {
    const elem = this.elem.nativeElement;
    if (btn.classList.contains('selector') && btn.classList.contains('active')) {
      this.renderer.removeClass(elem, 'active');
    } else {
      this.renderer.addClass(elem, 'active');
    }
  }
 /* @HostListener('document:click', ['$event'])
  clickout() {
    const elem = this.elem.nativeElement;
    if (!elem.classList.contains('active')) {
      this.renderer.removeClass(elem, 'active');
    }

    this.renderer.removeClass(elem, 'active');
  }*/
}

@Directive({
  selector: '[mobileFilter]'
})
export class MobileFilterDirective {
  isOpen = false;
  constructor(private elem: ElementRef, private renderer: Renderer2) {
  }
  @HostListener('click', ['$event.target'])
  onClick(btn: any) {
    const elem = this.elem.nativeElement;
    if (btn.classList.contains('filter') && btn.classList.contains('selected') || btn.classList.contains('filter_apply_btn')) {
      this.renderer.removeClass(elem, 'selected');
    } else {
      this.renderer.addClass(elem, 'selected');
    }
  }
 /* @HostListener('document:click', ['$event'])
  clickout() {
    const elem = this.elem.nativeElement;
    if (!elem.classList.contains('active')) {
      this.renderer.removeClass(elem, 'active');
    }

    this.renderer.removeClass(elem, 'active');
  }*/
}
