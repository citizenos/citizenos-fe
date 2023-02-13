import { HostBinding, Component, Directive, OnInit, OnDestroy, Input, ViewContainerRef, Output, HostListener, EventEmitter, forwardRef, Host, Inject } from '@angular/core';

@Directive({ selector: '[typeaheadItem]' })
export class TypeaheadItem implements OnDestroy {

  @HostBinding('class.active') get isActive() { return this.typeaheadItem?.id === this.typeahead?.active?.id; }
  constructor(@Host() @Inject(forwardRef(() => TypeaheadComponent)) private typeahead: TypeaheadComponent) {
  }

  @Input() typeaheadItem: any;
  ngOnDestroy(): void {
  }
}

@Component({
  selector: 'typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss']
})
export class TypeaheadComponent implements OnInit {
  @Output() enterAction = new EventEmitter<any | null>();
  @Input() selectLimit: number | null | undefined;
  @Input() items: string[] | any = [];
  @Input() term: string | undefined | null = null;
  @Input() placeholder: string | undefined;
  @Input() label: string | undefined;
  @Output() select = new EventEmitter<any | null>();
  @Output() search = new EventEmitter<string | null>();

  itemsNoClose: any = [];// Do not close the search results for these items
  hide = false;
  active: any;
  focused: boolean = false;
  mousedOver: boolean = false;
  constructor(private view: ViewContainerRef) {
  }

  ngOnInit(): void {
  }
  @HostListener('mouseover') onMouseEnter() {
    this.mousedOver = true;
  }

  @HostListener('focus') focus() {
    this.focused = true;
  };

  @HostListener('blur') blur() {
    this.focused = false;
  };

  @HostListener('keyup', ['$event']) keyup(e: any) {
    if (e.keyCode === 13) { // ENTER
      if (!this.selectLimit || (this.term && (this.selectLimit <= this.term.length)) || (this.items && this.items.length)) {
        this.selectActive();
      } else {
        this.doEnterAction();
      }
    }

    if (e.keyCode === 27) { // ESC
      this.hide = true;
      this.term = null;
    }
  };

  @HostListener('keydown', ['$event']) keydown(e: any) {
    if (e.keyCode === 13) { // ENTER
      e.preventDefault();
    }

    if (e.keyCode === 40 || e.keyCode === 9) { // DOWN OR TAB
      e.preventDefault();
      this.activateNextItem();
    }

    if (e.keyCode === 38) {
      e.preventDefault();
      this.activatePreviousItem();
    }
  };


  activate(item: any) {
    this.active = item;
  };

  activateNextItem() {
    const index = this.items.indexOf(this.active);
    this.activate(this.items[(index + 1) % this.items.length]);
  };

  activatePreviousItem() {
    const index = this.items.indexOf(this.active);
    this.activate(this.items[index === 0 ? this.items.length - 1 : index - 1]);
  };

  isActive(item: any) {
    return this.active === item;
  };

  selectActive() {
    if (!this.active) this.active = this.items[0];
    this.doSelect(this.active);
  };

  doEnterAction() {
    if (this.enterAction)
      this.enterAction.emit({ text: this.term, limit: true });
  };

  doSelect(item: any) {
    if (this.itemsNoClose.indexOf(item) < 0) {
      this.hide = true;
      this.focused = true;
      this.term = '';
      this.items = [];
      this.active = null;
    }
    if (this.select)
      this.select.emit(item);
  };

  isVisible() {
    return !this.hide && (this.focused || this.mousedOver);
  };

  query() {
    this.hide = false;
    this.itemsNoClose = [];
    this.search.emit(this.term);
  };
}
