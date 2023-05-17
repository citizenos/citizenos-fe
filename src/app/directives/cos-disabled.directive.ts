import { Directive, Input, ElementRef, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[cosDisabled]'
})
export class CosDisabledDirective {
  @Input() cosDisabled!: any;
  constructor(private ElementRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (this.cosDisabled) {
      this.ElementRef.nativeElement.setAttribute('disabled', true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cosDisabled'].currentValue === true) {
      this.ElementRef.nativeElement.setAttribute('disabled', true);
    } else {
      this.ElementRef.nativeElement.removeAttribute('disabled');
    }
  }
}
