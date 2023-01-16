import { Injectable } from '@angular/core';
import { BehaviorSubject, of, switchMap, map, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class ItemsListService {
  defaultParams = {
    page: <number> 1,
    offset:<number> 0,
    limit:<number> 10,
    order:<string | null | undefined> '',
    orderBy:<string | null | undefined> '',
    sourcePartnerId: <string | null | undefined> '',
    search: <string | null | undefined> ''
  };
  items$ = this.loadItems();
  hasMore$ = new BehaviorSubject(false);
  countTotal$ = new BehaviorSubject(0);
  totalPages$ = new BehaviorSubject(1);
  page$ = new BehaviorSubject(1);
  abstract params$: BehaviorSubject<any>;
  constructor() {
  }

  doOrder (orderBy: string, order?:string) {
    this.page$.next(1);
    const params = this.params$.value;
    params.orderBy = orderBy;
    if (order) {
      params.order = order.toUpperCase();
    }
    this.params$.next(params);
  };

  loadPage (page:number) {
    this.page$.next(page);
  };

  loadItems() {
    return combineLatest([this.page$, this.params$]).pipe(
      switchMap(([page, params]) => {
        params.offset = (page - 1) * params.limit;
        return this.getItems(params);
      }),
      map((res: any) => {
        this.countTotal$.next(res.countTotal || 0);
        this.totalPages$.next(Math.ceil(this.countTotal$.value / this.params$.value.limit));
        return Array.from(res.rows);
      })
    );
  }

  abstract getItems(params?: any) :any;
}
