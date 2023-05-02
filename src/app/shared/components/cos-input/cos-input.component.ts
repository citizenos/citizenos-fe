import { Component, ElementRef,  Input } from '@angular/core';

@Component({
  selector: 'cos-input',
  templateUrl: './cos-input.component.html',
  styleUrls: ['./cos-input.component.scss']
})
export class CosInputComponent {
  @Input() placeholder?: string;
  placeholderElement?: HTMLElement;
  constructor (private elementRef: ElementRef) {}

  ngAfterViewInit() {
    const input = this.elementRef.nativeElement.querySelector('input');
    if (input.value.length) {
      input.classList.add('with_value');
    }
    this.placeholderElement = this.elementRef.nativeElement.querySelector('.cos_input_placeholder');
    input.addEventListener('input', this.editText.bind(this));
  }

  editText (e: Event) {
    const input = e.target as HTMLInputElement;

    this.placeholderElement?.classList.remove('hidden');
    input.classList.add('with_value');
    if (!input.value.length) {
      input.classList.remove('with_value');
      this.placeholderElement?.classList.add('hidden');
    }
  }
}
