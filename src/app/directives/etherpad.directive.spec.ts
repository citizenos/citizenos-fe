import { EtherpadDirective } from './etherpad.directive';
import { ElementRef } from '@angular/core';

describe('EtherpadDirective', () => {
  let elementRef: ElementRef;
  let directive: EtherpadDirective;

  beforeEach(() => {
    elementRef = new ElementRef(document.createElement('iframe'));
    directive = new EtherpadDirective(elementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should call ngOnDestroy without errors', () => {
    expect(() => directive.ngOnDestroy()).not.toThrow();
  });
});
