import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[check-height]'
})
export class CheckHeightDirective {
  offsetHeight!:any;
  @HostBinding('class.overheight') overHeight=false;

  readMore = false;
  maxTextHeight = 200;
  constructor(private elem: ElementRef) {

  }

  ngAfterContentInit(): void {
    this.offsetHeight = this.elem.nativeElement.offsetHeight;

    console.log(this.offsetHeight, this.maxTextHeight)
    if(this.offsetHeight > this.maxTextHeight) {
      this.overHeight = true
    }
  }
}
