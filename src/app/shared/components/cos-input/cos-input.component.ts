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

  ngAfterContentChecked() {
    const input = this.elementRef.nativeElement.querySelector('input, .dropdown');
    this.placeholderElement = this.elementRef.nativeElement.querySelector('.cos_input_placeholder');
    input.classList.add('with_value');
    this.placeholderElement?.classList.add('show');

    if (!input.value?.length && !input.classList.contains('dropdown')) {
      input.classList.remove('with_value');
      this.placeholderElement?.classList.remove('show');
    }
  }
}
