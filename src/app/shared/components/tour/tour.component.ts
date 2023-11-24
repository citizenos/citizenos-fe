import { Observable, of, tap, take, combineLatest, switchMap, map } from 'rxjs';
import { TourService } from 'src/app/services/tour.service';
import { Component, ElementRef, HostListener, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent {
  title?: string;
  public top = '';
  public left = '';
  @ViewChild('arrow') arrow!: ElementRef;
  @ViewChild('tourBox') tourBox!: ElementRef;
  @ViewChild('tourContent') contentEl!: ElementRef;
  @HostListener('window:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {
    if (event.key.toString() === 'Escape') this.TourService.hide();
  }
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
          let element = item.elements[offset];
          if (!element) {
            element = item.elements[offset - 1];
          }
          const elNode = element.el.nativeElement;
          const style = window.getComputedStyle(elNode);
          const visible = !!(elNode.offsetWidth || elNode.offsetHeight || elNode.getClientRects().length);

          if (elNode && (style.display === 'none' || !visible) && item.elements.length > 1) {
            element = checkItemEl(item, offset + 1);
          }
          return element;
        }

        let offset = 0;
        let itemEl = checkItemEl(item, offset);
        if (!itemEl) return of([item, isVisible]);
        const itemRect = itemEl.el.nativeElement.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        const itemOffsetTop = itemRect.top - bodyRect.top;
        const itemOffsetBottom = itemRect.bottom - bodyRect.top;
        const itemOffsetLeft = itemRect.left - bodyRect.left;
        const tourBox = this.tourBox.nativeElement;
        const tourBoxElementRect = tourBox.getBoundingClientRect();
        const arrowEl = this.arrow.nativeElement;
        this.renderer.setStyle(tourBox, 'top', `${itemOffsetTop}px`);
        let left = 0;

        switch (itemEl.position) {
          case 'right':
            arrowEl.classList.remove('top_arrow');
            arrowEl.classList.remove('bottom_arrow');
            arrowEl.classList.remove('right_arrow');
            arrowEl.classList.add('left_arrow');

            left = itemRect.right + 12;
            if (left < 0) {
              left = 0;
            }
            this.renderer.setStyle(arrowEl, 'left', `${itemRect.right + 6}px`);
            this.renderer.setStyle(arrowEl, 'top', `${itemOffsetTop + itemRect.height / 2}px`);
            this.renderer.setStyle(tourBox, 'left', `${left}px`);

            tourBox.scrollIntoView();
            break;
          case 'left':
            arrowEl.classList.remove('top_arrow');
            arrowEl.classList.remove('bottom_arrow');
            arrowEl.classList.remove('left_arrow');
            arrowEl.classList.add('right_arrow');
            left = itemRect.left - tourBoxElementRect.width - 6;
            if (left < 0) {
              left = 0;
            }
            this.renderer.setStyle(arrowEl, 'left', `${itemRect.left - 6}px`);
            this.renderer.setStyle(arrowEl, 'top', `${itemOffsetTop + itemRect.height / 2}px`);
            this.renderer.setStyle(tourBox, 'left', `${left}px`);

            tourBox.scrollIntoView();
            break;
          case 'top':
            arrowEl.classList.remove('right_arrow');
            arrowEl.classList.remove('left_arrow');
            arrowEl.classList.remove('bottom_arrow');
            arrowEl.classList.add('top_arrow');
            this.renderer.setStyle(arrowEl, 'left', `${itemRect.left + itemRect.width / 2}px`);
            this.renderer.setStyle(arrowEl, 'top', `${itemOffsetTop - 12}px`);
            this.renderer.setStyle(tourBox, 'left', `${itemOffsetLeft + itemRect.width / 2 - tourBoxElementRect.width / 2}px`);
            this.renderer.setStyle(tourBox, 'top', `${itemOffsetTop - tourBoxElementRect.height - 12}px`);
            tourBox.scrollIntoView();
            break;
          case 'bottom':
            arrowEl.classList.remove('top_arrow');
            arrowEl.classList.remove('right_arrow');
            arrowEl.classList.remove('left_arrow');
            arrowEl.classList.add('bottom_arrow');
            this.renderer.setStyle(arrowEl, 'left', `${itemRect.left + itemRect.width / 2}px`);
            this.renderer.setStyle(arrowEl, 'top', `${itemOffsetBottom + 6}px`);
            this.renderer.setStyle(tourBox, 'left', `${itemRect.left + itemRect.width / 2 - tourBoxElementRect.width / 2}px`);
            this.renderer.setStyle(tourBox, 'top', `${itemOffsetBottom + 18}px`);
            itemEl.el.nativeElement.scrollIntoView();
            break;
          default:
            this.renderer.setStyle(arrowEl, 'left', `${itemRect.right + 6}px`);
            this.renderer.setStyle(arrowEl, 'top', `${itemOffsetTop + itemRect.height / 2}px`);
            this.renderer.setStyle(tourBox, 'left', `${left}px`);
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
