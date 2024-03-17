import { DialogService } from './dialog/dialog.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { InterruptDialogComponent } from 'src/app/shared/components/interrupt-dialog/interrupt-dialog.component';
import { Injectable } from '@angular/core';

export interface BlockNavigationIfChange {
  hasChanges$: BehaviorSubject<boolean>;
}

@Injectable({ providedIn: 'root' })
export class CanDeactivateBlockNavigationIfChange<T extends BlockNavigationIfChange> {
  constructor(private dialog: DialogService) {}
  canDeactivate(component: T, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return new Observable<boolean>((observer) => {
      component.hasChanges$.pipe(take(1)).subscribe((hasChanges: boolean) => {
        if (hasChanges) {
          const interuptdialog = this.dialog.open(InterruptDialogComponent);
          interuptdialog.afterClosed().subscribe({next: (result) => {
            if (result === true) {
              observer.next(result);
              observer.complete();
            }
          }})
        } else {
          observer.next(true);
          observer.complete();
        }
      });
    });
  }
}
