import { CosDisabledDirective } from './cos-disabled.directive';
import { ElementRef } from '@angular/core';

describe('CosDisabledDirective', () => {
  it('should create an instance', () => {
    const elementRefMock = { nativeElement: document.createElement('div') } as ElementRef;
    const directive = new CosDisabledDirective(elementRefMock);
    expect(directive).toBeTruthy();
  });

  describe('CosDisabledDirective', () => {
    it('should create an instance', () => {
      const elementRefMock = { nativeElement: document.createElement('div') } as ElementRef;
      const directive = new CosDisabledDirective(elementRefMock);
      expect(directive).toBeTruthy();
    });

    it('should set ElementRef correctly', () => {
      const elementRefMock = { nativeElement: document.createElement('div') } as ElementRef;
      const directive = new CosDisabledDirective(elementRefMock);
      expect(directive['ElementRef']).toBe(elementRefMock);
    });
  });


});
