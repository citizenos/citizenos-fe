import { DownloadDirective } from './download.directive';
import { ElementRef } from '@angular/core';


  describe('DownloadDirective', () => {
    let directive: DownloadDirective;
    let elementRef: ElementRef;

    beforeEach(() => {
      elementRef = new ElementRef(document.createElement('a'));
      directive = new DownloadDirective(elementRef);
    });

    it('should create an instance', () => {
      expect(directive).toBeTruthy();
    });

    it('should add click event listener on ngAfterViewInit', () => {
      spyOn(elementRef.nativeElement, 'addEventListener');
      directive.ngAfterViewInit();
      expect(elementRef.nativeElement.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it('should open link in new tab on click', () => {
      const event = new MouseEvent('click');
      const linkElement = elementRef.nativeElement as HTMLLinkElement;
      linkElement.href = 'http://example.com';
      spyOn(window, 'open');

      directive.linkClickHandler(event);

      expect(window.open).toHaveBeenCalledWith('http://example.com', '_blank');
    });

    it('should not open link if href is not present', () => {
      const event = new MouseEvent('click');
      const linkElement = elementRef.nativeElement as HTMLLinkElement;
      linkElement.href = '';
      spyOn(window, 'open');

      directive.linkClickHandler(event);

      expect(window.open).not.toHaveBeenCalled();
    });
  });
