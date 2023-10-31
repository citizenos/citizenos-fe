import { Observable, of, tap, take, combineLatest, switchMap, map } from 'rxjs';
import { TourService } from './../../../services/tour.service';
import { Component, ElementRef, Input, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent {
  title?: string;
  public top = '';
  public left = '';
  @ViewChild('tourBox') tourBox!: ElementRef;
  @ViewChild('tourContent') contentEl!: ElementRef;
  items$: Observable<any[]> = of([]);
  showItem$: Observable<any> = of(false);
  itemTemplate$: Observable<any> = of('');
  tourId$: Observable<string> = of('');
  templateSubscription: Observable<any>;
  constructor(private tourEl: ElementRef, private TourService: TourService, private renderer: Renderer2) {
    this.templateSubscription = combineLatest([this.TourService.getTemplate(), this.TourService.showTour]).pipe(
      switchMap(([elem, isVisible]) => {
        if (isVisible) {
          this.setContent(elem);
        }
        return of(elem);
      }));
    this.tourId$ = this.TourService.activeTour;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.showItem$ = this.TourService.showTour.pipe(tap((isVisible: boolean) => {
      if (isVisible) {
        const item = this.TourService.getActiveItem();
      }
    }));
    this.items$ = this.TourService.getItems();
  }

  ngOnDestroy(): void {
  }
  setContent(ctemp: any) {
    if (this.contentEl) {
      this.contentEl.nativeElement.replaceChildren(...ctemp);
    }
  }

  setPosition() {
    return combineLatest([this.TourService.getActiveItem(), this.TourService.showTour]).pipe(map(([item, isVisible]) => {
      if (item && isVisible) {
        function checkItemEl(item: any, offset: number): any {
          let element = item.elements[offset]?.nativeElement;
          if (!element) {
            element = item.elements[offset - 1]?.nativeElement;
          }
          const style = window.getComputedStyle(element);

          console.log('ELEMENT', element, style.display, element.offsetParent)
          if (element && (style.display === 'none') && item.elements.length > 1) {
            element = checkItemEl(item, offset + 1);
          }
          return element;
        }

        let offset = 0;
        let itemEl = checkItemEl(item, offset);
        if (!itemEl) return of([item, isVisible]);
        const itemRect = itemEl.getBoundingClientRect();
        const tourBox = this.tourBox.nativeElement;
        const tourBoxElementRect = tourBox.getBoundingClientRect();
        this.renderer.setStyle(tourBox, 'top', `${itemRect.top}px`);
        switch (item.position) {
          case 'right':
            tourBox.classList.remove('top_arrow');
            tourBox.classList.remove('bottom_arrow');
            tourBox.classList.remove('right_arrow');
            tourBox.classList.add('left_arrow');
            this.renderer.setStyle(tourBox, 'left', `${itemRect.right + 20}px`);
            break;
          case 'left':
            tourBox.classList.remove('top_arrow');
            tourBox.classList.remove('bottom_arrow');
            tourBox.classList.remove('left_arrow');
            tourBox.classList.add('right_arrow');
            this.renderer.setStyle(tourBox, 'left', `${itemRect.left - tourBoxElementRect.width - 20}px`);
            break;
          case 'top':
            tourBox.classList.remove('right_arrow');
            tourBox.classList.remove('left_arrow');
            tourBox.classList.remove('bottom_arrow');
            tourBox.classList.add('top_arrow');
            this.renderer.setStyle(tourBox, 'left', `${itemRect.left + (itemRect.width / 2) - 200}px`);
            this.renderer.setStyle(tourBox, 'top', `${itemRect.top - tourBoxElementRect.height - 20}px`);
            break;
          case 'bottom':
            tourBox.classList.remove('top_arrow');
            tourBox.classList.remove('right_arrow');
            tourBox.classList.remove('left_arrow');
            tourBox.classList.add('bottom_arrow');
            this.renderer.setStyle(tourBox, 'left', `${itemRect.left + (itemRect.width / 2) - 200}px`);
            this.renderer.setStyle(tourBox, 'top', `${itemRect.bottom + 20}px`);
            break;
          default:
            this.renderer.setStyle(tourBox, 'left', `${itemRect.right}px`);
        }
      }
      return of([item, isVisible]);
    }));
  }

  isActive(item: any) {
    return this.TourService.activeItem.value === item.index;
  }

  nextItem(event: Event) {
    event.stopPropagation();
    this.TourService.next();
  }

  prevItem(event: Event) {
    event.stopPropagation();
    this.TourService.previous();
  }

  closeTour(event: Event) {
    event.stopPropagation();
    this.TourService.hide();
  }

  activeIndex() {
    return this.TourService.activeItem.value;
  }

  sort(items: any[]) {
    function sortFunc(a: any, b: any) {
      if (a.index < b.index) {
        return -1;
      }
      if (a.index > b.index) {
        return 1;
      }
      return 0;
    }

    return items.sort(sortFunc);
  }

}
