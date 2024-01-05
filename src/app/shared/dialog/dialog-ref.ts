import { OverlayRef } from '@angular/cdk/overlay';
import { Input, ContentChildren, Directive, ElementRef, HostListener, Injectable, QueryList } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * A reference to the dialog itself.
 * Can be injected into the component added to the overlay and then used to close itself.
 */

@Directive({
  selector: '[dialog-close]'
})
export class DialogCloseDirective {
  @Input('dialog-close') dialogClose?:any;
  @HostListener('click') click() {
    this.dialog.close(this.dialogClose);
  }

  constructor(private el: ElementRef, private dialog: DialogRef<any>) {
  }


  ngOnInit(): void {
    console.log(this.dialog);
  }
}

@Injectable()
export class DialogRef <T, R = any> {
  private afterClosedSubject = new Subject<any>();
  component?: any;
  @ContentChildren(DialogCloseDirective) closeItem!: QueryList<DialogCloseDirective>;
  constructor(private overlayRef: OverlayRef) {
  }
  /**
   * Closes the overlay. You can optionally provide a result.
   */
  public close(result?: any) {
    this.overlayRef.dispose();
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }

  /**
   * An Observable that notifies when the overlay has closed
   */
  public afterClosed(): Observable<any> {
    return this.afterClosedSubject.asObservable();
  }

  public setComponent(component: any) {
    this.component = component;
  }
}
