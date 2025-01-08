import { HtmlDirective } from './html.directive';
import { ElementRef } from '@angular/core';

describe('HtmlDirective', () => {
  let directive: HtmlDirective;
  let elementRef: ElementRef;

  beforeEach(() => {
    elementRef = new ElementRef(document.createElement('div'));
    directive = new HtmlDirective(elementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should add click event listeners to all anchor tags in ngAfterViewInit', () => {
    const anchor1 = document.createElement('a');
    const anchor2 = document.createElement('a');
    elementRef.nativeElement.appendChild(anchor1);
    elementRef.nativeElement.appendChild(anchor2);

    spyOn(anchor1, 'addEventListener');
    spyOn(anchor2, 'addEventListener');

    directive.ngAfterViewInit();

    expect(anchor1.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
    expect(anchor2.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
  });

  it('should open link in a new tab when linkClickHandler is called', () => {
    const event = new MouseEvent('click');
    const anchor = document.createElement('a');
    anchor.href = 'https://example.com';

    spyOn(window, 'open');

    directive.linkClickHandler(event);

    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
  });
});
