import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, combineLatest, of, tap, take } from 'rxjs';

export interface TourItem {
  index: number,
  elements: any[],
  position: string
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

  register(id: string, index: number, element: ElementRef, position: string) {
    if (!(this.items[id])) {
      return this.items[id] = [{index, elements: <any[]>[{el: element, position}]}];
    }
    const item = this.items[id].find((item: TourItem) => {
      return item.index === index;
    });

    if (!item) {
      return this.items[id].push({index, elements: <any[]>[{el: element, position}] , position});
    } else {
      let added = false;
      item.elements.forEach((elem: any, index: number)=> {
        if (elem.el.nativeElement.id === element.nativeElement.id) {
          item.elements.splice(index, 1, {el: element, position});
          added = true;
        }
      });

      if (!added) {
        item.elements.push({el: element, position});
      }
    }
  }

  addTemplate(id: string, index: number, template: any) {
    const templateData = Object.assign([], template);
    if (!this.templates[id]) {
      return this.templates[id] = [{ index, template: templateData }];
    }

    const item = this.templates[id].find((item: any) => {
      return item.index === index;
    });
    if (!item) {
      return this.templates[id].push({ index, template: templateData });
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
                item.elements?.forEach((element) => {
                  element.el.nativeElement.classList.remove('tour_item');
                  if (item.index === itemId) {
                    element.el.nativeElement.classList.add('tour_item');
                  }
                })
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
    document.querySelectorAll('.tour_item').forEach((item) => {
      item.classList.remove('tour_item');
    });
    this.showTour.next(false);
    this.activeTour.next('');
    this.activeItem.next(0);
  }

  next() {
    combineLatest([this.activeTour, this.activeItem]).pipe(take(1)).subscribe({
      next: ([tourId, index]) => {
        const itemIndexes  = this.items[tourId].map((item: any) => item.index);
        const curItemIndex = itemIndexes.sort().indexOf(index);
        const nextItem = this.items[tourId].find((item: any) => {
          return item.index === itemIndexes[curItemIndex +1];
        });
        if (!nextItem) return this.hide();
        this.activeItem.next(itemIndexes[curItemIndex +1]);
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  previous() {
    combineLatest([this.activeTour, this.activeItem]).pipe(take(1)).subscribe({
      next: ([tourId, index]) => {
        const itemIndexes  = this.items[tourId].map((item: any) => item.index);
        const curItemIndex = itemIndexes.sort().indexOf(index);
        this.activeItem.next(itemIndexes.sort()[curItemIndex-1]);
      }
    });
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
