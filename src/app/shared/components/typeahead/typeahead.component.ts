import { HostBinding, Component, ElementRef, Directive, OnInit, OnDestroy, Input, Output, HostListener, EventEmitter, forwardRef, Inject, ViewChild } from '@angular/core';

@Directive({ selector: '[typeaheadItem]' })
export class TypeaheadItem implements OnDestroy {
  @Input() typeaheadItem!: any;
  @Input() noClose!: boolean;
  @HostBinding('class.active') get isActive() { return this.typeaheadItem?.id === this.typeahead?.active?.id; }

  @HostListener('mouseover', []) onMouseEnter() {
    this.typeahead.activate(this.typeaheadItem);
  }
  constructor(@Inject(forwardRef(() => TypeaheadComponent)) private typeahead: TypeaheadComponent, private el: ElementRef) {
  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit() {
    if (this.noClose) this.typeaheadItem.noClose = true;
    this.typeahead.registerElement(this.typeaheadItem);
  }
}

@Directive({ selector: '[typeaheadSelect]' })
export class TypeaheadSelect implements OnDestroy {
  @Input() typeaheadSelect!: any;
  @HostListener('click', []) onClick() {
    this.typeahead.activate(this.typeaheadSelect);
    this.typeahead.selectActive();
  }
  constructor(@Inject(forwardRef(() => TypeaheadComponent)) private typeahead: TypeaheadComponent, private el: ElementRef) {
  }
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
  @Input() term: string | undefined | null = null;
  @Input() placeholder: string | undefined;
  @Input() label: string | undefined;
  @Input() activeClass: string | undefined;
  @Output() select = new EventEmitter<any | null>();
  @Output() search = new EventEmitter<string | null>();
  @ViewChild('input') searchInput?: ElementRef;

  hide = false;
  active: any;
  itemList: any[] = [];
  focused: boolean = false;
  constructor(private _el: ElementRef) {
  }

  registerElement(el: any) {
    this.itemList.push(el);
  }

  ngOnInit(): void {
  }

  focus() {
    this._el.nativeElement.classList.add(this.activeClass || 'active');
    this.focused = true;
  };

  blur() {
    setTimeout(() => {
      this._el.nativeElement.classList.remove(this.activeClass || 'active');
      this.focused = false;
    }, 200);
  };

  @HostListener('keyup', ['$event']) keyup(e: any) {
    if (e.keyCode === 13) { // ENTER
      if (!this.selectLimit || (this.term && (this.selectLimit <= this.term.length)) || (this.itemList && this.itemList.length)) {

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

  getActiveIndex() {
    if (this.active) {
      const active = this.itemList.find((item) => item?.id === this.active?.id);
      return this.itemList.indexOf(active);
    }
    return 0;
  }

  activate(item: any) {
    this.active = item;
  };

  activateNextItem() {
    const index = this.getActiveIndex();
    this.activate(this.itemList[(index + 1) % this.itemList.length]);
  };

  activatePreviousItem() {
    const index = this.getActiveIndex();
    this.activate(this.itemList[index === 0 ? this.itemList.length - 1 : index - 1]);
  };

  isActive(item: any) {
    return this.active === item;
  };

  selectActive() {
    if (!this.active) this.active = this.itemList[0];
    this.doSelect(this.active);
  };

  doEnterAction() {
    this.itemList = [];

    if (this.enterAction) {
      this.enterAction.emit({ text: this.term, limit: true });
    } else {
      this.selectActive();
    }
  };

  doSelect(item: any) {
    this.hide = true;
    this.focused = true;
    this.term = '';
    this.itemList = [];
    this.active = null;

    if (this.select)
      this.select.emit(item);
  };

  query() {
    this.hide = false;
    this.itemList = [];
    this.search.emit(this.term);
  };
}
