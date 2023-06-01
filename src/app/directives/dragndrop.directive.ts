import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[dragndrop]'
})
export class DragndropDirective {
  @Output() fileDropped = new EventEmitter();
  @HostListener('dragover', ['$event']) onDragOver(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();

    console.log('drag over');
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();

    console.log('drag leave');
  }

  @HostListener('drop', ['$event']) onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    console.log('drag over');
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
  constructor() { }

}
