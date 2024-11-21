import { TourItemDirective } from './tour-item.directive';
import { ElementRef } from '@angular/core';
import { TourService } from '@services/tour.service';

describe('TourItemDirective', () => {
    let directive: TourItemDirective;
    let mockElementRef: ElementRef;
    let mockTourService: jasmine.SpyObj<TourService>;

    beforeEach(() => {
      mockElementRef = new ElementRef(document.createElement('div'));
      mockTourService = jasmine.createSpyObj('TourService', ['register']);
      directive = new TourItemDirective(mockElementRef, mockTourService);
    });

    it('should create an instance', () => {
      expect(directive).toBeTruthy();
    });

    it('should register single tour item on ngOnInit', () => {
      directive.data = {
        tourid: 'tour1',
        index: 0,
        position: 'top'
      };

      directive.ngOnInit();

      expect(mockTourService.register).toHaveBeenCalledWith('tour1', 0, mockElementRef, 'top');
    });

    it('should register multiple tour items on ngOnInit', () => {
      directive.data = {
        tourid: ['tour1', 'tour2'],
        index: [0, 1],
        position: ['top', 'bottom']
      };

      directive.ngOnInit();

      expect(mockTourService.register).toHaveBeenCalledWith('tour1', 0, mockElementRef, 'top');
      expect(mockTourService.register).toHaveBeenCalledWith('tour2', 1, mockElementRef, 'bottom');
    });

    it('should use first index and position if array length is less than tourid length', () => {
      directive.data = {
        tourid: ['tour1', 'tour2'],
        index: [0],
        position: ['top']
      };

      directive.ngOnInit();

      expect(mockTourService.register).toHaveBeenCalledWith('tour1', 0, mockElementRef, 'top');
      expect(mockTourService.register).toHaveBeenCalledWith('tour2', 0, mockElementRef, 'top');
  });
});
