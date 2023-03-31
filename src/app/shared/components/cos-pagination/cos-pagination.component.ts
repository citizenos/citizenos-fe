import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cos-pagination',
  templateUrl: './cos-pagination.component.html',
  styleUrls: ['./cos-pagination.component.scss']
})
export class CosPaginationComponent implements OnInit {
  @Input() totalPages:number = 0;
  @Input() page:number = 1;
  @Output() select = new EventEmitter<any | null>();
  constructor() { }

  ngOnInit(): void {
  }

  pages() {
    const array = [];

    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        array.push(i);
      }
    } else if (this.page < 4) {
      for (let i = 1; i < 6; i++) {
        array.push(i);
      }
    } else if (this.totalPages - this.page >= 2) {
      for (let i = -2; i < 3; i++) {
        array.push(this.page + i);
      }
    } else {
      for (let i = -4; i < 1; i++) {
        array.push(this.totalPages + i);
      }
    }

    return array;
  };

  doSelect (page:number) {
    this.select.emit(page);
  }

  loadNext() {
    if (this.page === this.totalPages) {
      return;
    }
    this.doSelect(this.page + 1);
  };

  loadPrevious() {
    if (this.page === 1) {
      return;
    }

    this.doSelect(this.page - 1);
  };
}
