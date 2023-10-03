import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, combineLatest, of, tap } from 'rxjs';

export interface TourItem {
  index: number,
  element: any
}

@Injectable({
  providedIn: 'root'
})
export class TourService {
  items = <any>{};
  showTour = new BehaviorSubject(false);
  activeTour = new BehaviorSubject('');
  activeItem = new BehaviorSubject(0);
  activeEl?: any;
  overlay = document.createElement('div');
  templates: any = {};
  position?: any;
  constructor() {
    this.overlay.classList.add('tour_overlay');
  }

  register(id: string, data: any) {
    if (!(this.items[id])) {
      return this.items[id] = [data];
    }
    const item = this.items[id].find((item: TourItem) => {
      return item.index === data.index;
    });
    if (!item) {
      return this.items[id].push(data);
    }
  }

  addTemplate(id: string, index: number, template: any) {
    if (!this.templates[id]) {
      return this.templates[id] = [{ index, template }];
    }

    const item = this.templates[id].find((item: any) => {
      return item.index === index;
    });
    if (!item) {
      return this.templates[id].push({ index, template });
    }
  }

  getTemplate() {
    return combineLatest([this.activeTour, this.activeItem]).pipe(
      switchMap(([tourId, itemId]) => {
        let templateItem;
        if (this.templates[tourId]) {
          templateItem = this.templates[tourId].find((temp: any) => {
            return temp.index === itemId;
          });
          if (templateItem) {
            let item;
            if (this.items && this.items[tourId]) {
              item = this.items[tourId].find((item: TourItem) => {
                item.element.nativeElement.classList.remove('tour_item');
                if (item.index === itemId) {
                  item.element.nativeElement.classList.add('tour_item');
                }
              });
            }
            return of(templateItem.template);
          }
        }
        return of('');
      })
    );
  }

  getItems() {
    return this.activeTour.pipe(switchMap((tourId: string) => {
      const items = this.items[tourId];
      return of(items || []);
    }));
  }

  show(id: string, index: number) {
    const overlay = document.body.querySelectorAll('tour_overlay');
    if (overlay.length === 0)
      document.body.appendChild(this.overlay);
    this.activeTour.next(id);
    this.activeItem.next(index);
    this.showTour.next(true);
  }

  hide() {
    document.querySelectorAll('.tour_overlay').forEach((overlay) => {
      overlay.remove();
    });
    this.showTour.next(false);
    this.activeTour.next('');
    this.activeItem.next(0);
  }

  next() {
    const currentIndex = this.activeItem.value;
    const nextItem = this.items[this.activeTour.value].find((item: any) => {
      return item.index === currentIndex + 1;
    });
    if (!nextItem) return this.hide();

    this.activeItem.next(this.activeItem.value + 1);
  }

  previous() {
    const currentIndex = this.activeItem.value;
    if (currentIndex > 1) {
      const nextItem = this.items[this.activeTour.value].find((item: any) => {
        return item.index === currentIndex - 1;
      });
    }

    this.activeItem.next(this.activeItem.value - 1);
  }

  getActiveItem() {
    return combineLatest([this.activeTour, this.activeItem]).pipe(
      switchMap(([tourId, itemId]) => {
        let item;
        if (this.items && this.items[tourId]) {
          item = this.items[tourId].find((item: TourItem) => {
            return item.index === itemId;
          });

          if (item) {
            return of(item);
          }
        }
        return of('');
      })
    );
  }
}
