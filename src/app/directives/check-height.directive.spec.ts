import { CheckHeightDirective } from './check-height.directive';
import { ElementRef } from '@angular/core';

describe('CheckHeightDirective', () => {
  it('should create an instance', () => {
    const elementRef = new ElementRef({ offsetHeight: 0 });
    const directive = new CheckHeightDirective(elementRef);
    expect(directive).toBeTruthy();
  });

  describe('CheckHeightDirective', () => {
    let directive: CheckHeightDirective;
    let elementRef: ElementRef;

    beforeEach(() => {
      elementRef = new ElementRef({ offsetHeight: 0 });
      directive = new CheckHeightDirective(elementRef);
    });

    it('should create an instance', () => {
      expect(directive).toBeTruthy();
    });

    it('should set overHeight to true if offsetHeight is greater than maxTextHeight', () => {
      elementRef.nativeElement.offsetHeight = 300;
      directive.ngAfterContentInit();
      expect(directive.overHeight).toBe(true);
    });

    it('should set overHeight to false if offsetHeight is less than or equal to maxTextHeight', () => {
      elementRef.nativeElement.offsetHeight = 100;
      directive.ngAfterContentInit();
      expect(directive.overHeight).toBe(false);
    });
  });
});
