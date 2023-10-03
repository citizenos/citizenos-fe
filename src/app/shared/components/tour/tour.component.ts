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
  templateSubscription: Observable<any>;
  constructor(private tourEl: ElementRef, private TourService: TourService, private renderer: Renderer2) {
    this.templateSubscription = combineLatest([this.TourService.getTemplate(), this.TourService.showTour]).pipe(
      switchMap(([elem, isVisible]) => {
        if (isVisible) {
          this.setContent(elem);
        }
        return of(elem);
      }));
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
      this.contentEl.nativeElement.replaceChildren(ctemp);
    }
  }
  /*setPosition () {
    const elemPos = item.element.nativeElement.getBoundingClientRect();
    const posLeft = elemPos.left + elemPos.width;
    const posRight = elemPos.right + elemPos.width;
    this.top = `${elemPos.top}px`;
    this.left = `${posLeft}px`;
  }*/

  setPosition() {
    return combineLatest([this.TourService.getActiveItem(), this.TourService.showTour]).pipe(map(([item, isVisible]) => {
      if (item && isVisible) {
        const itemEl = item.element.nativeElement;
        const itemRect = itemEl.getBoundingClientRect();
        const tourBox =  this.tourBox.nativeElement;
        const tourBoxElementRect = tourBox.getBoundingClientRect();
    //    console.log(tourBoxElementRect);
        this.renderer.setStyle(tourBox, 'top', `${itemRect.top}px`);
        if ((itemRect.right + tourBox.width ) < window.innerWidth) {
          this.renderer.setStyle(tourBox, 'left', `${itemRect.right + tourBox.width}px`);
        } else {
          this.renderer.setStyle(tourBox, 'right', `${itemRect.right + tourBox.width}px`);
        }
      /*  this.renderer.setStyle(tourBox, 'left', '0px');
        this.renderer.setStyle(tourBox, 'right', 'auto');*/
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
}
