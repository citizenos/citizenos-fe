import { Subscription, switchMap, of } from 'rxjs';
import { TourService } from './../services/tour.service';
import { Directive, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'tour-item-template',
  template: '<div #template><ng-content></ng-content></div>'
})
export class TourItemTemplateComponent {
  @Input('data') data?: any;
  @ViewChild('template') template?: ElementRef;
  constructor(private el: ElementRef, private TourService: TourService) {
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    const template = this.template?.nativeElement.children;
    this.TourService.addTemplate(this.data.tourid, this.data.index, template);
    this.template?.nativeElement.classList.add('hidden');
  }
}

@Directive({
  selector: '[TourItem]'
})
export class TourItemDirective {
  @Input('TourItem') data?: any;
  constructor(private el: ElementRef, private TourService: TourService) {
  }

  ngOnInit(): void {
    if (Array.isArray(this.data.tourid)) {
      this.data.tourid.forEach((id:string, index: number) => {
        this.TourService.register(id, getValue(this.data.index, index), this.el, getValue(this.data.position, index));
      });
    } else {
      this.TourService.register(this.data.tourid, this.data.index, this.el, this.data.position);
    }

    function getValue (item: any, index: number) {
      if (Array.isArray(item)) {
        if (item[index])
          return item[index];
        return item[0];
      }

      return item;
    }
  }
}
