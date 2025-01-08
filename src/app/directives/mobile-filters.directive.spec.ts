import { MobileFiltersDirective } from './mobile-filters.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('MobileFiltersDirective', () => {
  describe('MobileFiltersDirective', () => {
    let directive: MobileFiltersDirective;
    let elementRef: ElementRef;
    let renderer: Renderer2;

    beforeEach(() => {
      elementRef = new ElementRef(document.createElement('div'));
      renderer = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);
      directive = new MobileFiltersDirective(elementRef, renderer);
    });

    it('should create an instance', () => {
      expect(directive).toBeTruthy();
    });

    it('should add "active" class if button does not have "active" class', () => {
      const button = document.createElement('button');
      button.classList.add('selector');
      directive.onClick(button);
      expect(renderer.addClass).toHaveBeenCalledWith(elementRef.nativeElement, 'active');
    });

    it('should remove "active" class if button has "active" class', () => {
      const button = document.createElement('button');
      button.classList.add('selector', 'active');
      directive.onClick(button);
      expect(renderer.removeClass).toHaveBeenCalledWith(elementRef.nativeElement, 'active');
    });

    it('should not add "active" class if button does not have "selector" class', () => {
      const button = document.createElement('button');
      directive.onClick(button);
      expect(renderer.addClass).not.toHaveBeenCalled();
    });

    it('should not remove "active" class if button does not have "selector" and "active" classes', () => {
      const button = document.createElement('button');
      directive.onClick(button);
      expect(renderer.removeClass).not.toHaveBeenCalled();
    });
  });
});
