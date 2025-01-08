import { CosDropdownDirective } from './cos-dropdown.directive';
import { ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

@Component({
  template: `<div cosDropdown></div>`
})
class TestComponent {}

describe('CosDropdownDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: CosDropdownDirective;
  let element: ElementRef;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CosDropdownDirective],
      providers: [
        Renderer2,
        {
          provide: ElementRef,
          useValue: {
            nativeElement: document.createElement('div')
          }
        }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.children[0];
    renderer = TestBed.inject(Renderer2);
    directive = new CosDropdownDirective(element, renderer);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should add class on key press if dropdown is active', () => {
    const nativeElement = element.nativeElement;
    nativeElement.classList.add('dropdown_active');
    const optionsWrap = document.createElement('div');
    optionsWrap.classList.add('options');
    nativeElement.appendChild(optionsWrap);
    const option = document.createElement('div');
    option.classList.add('option');
    option.innerText = 'a';
    optionsWrap.appendChild(option);

    const event = new KeyboardEvent('keydown', { key: 'a' });
    directive.onKeyPress(event);

    expect(option.scrollIntoView).toHaveBeenCalled();
  });

  it('should toggle dropdown_active class on click', () => {
    const nativeElement = element.nativeElement;
    directive.cosDropdownMobile = 'true';

    directive.onClick(nativeElement);
    expect(nativeElement.classList.contains('dropdown_active')).toBeTrue();

    nativeElement.classList.add('dropdown_selector');
    directive.onClick(nativeElement);
    expect(nativeElement.classList.contains('dropdown_active')).toBeFalse();
  });

  it('should remove dropdown_active class on document click', () => {
    const nativeElement = element.nativeElement;
    nativeElement.classList.add('dropdown_active');

    directive.clickout();
    expect(nativeElement.classList.contains('dropdown_active')).toBeFalse();
  });

  it('should handle mouseenter event', () => {
    const nativeElement = element.nativeElement;
    const dropdownWithDescription = document.createElement('div');
    dropdownWithDescription.classList.add('dropdown', 'with_description');
    nativeElement.appendChild(dropdownWithDescription);

    const dropdownItem = document.createElement('div');
    dropdownItem.classList.add('dropdown_item', 'item_1');
    dropdownWithDescription.appendChild(dropdownItem);

    const itemDescription = document.createElement('div');
    itemDescription.classList.add('item_description', 'item_1');
    dropdownWithDescription.appendChild(itemDescription);

    directive.mouseenter(dropdownItem);

    expect(dropdownItem.classList.contains('active')).toBeTrue();
    expect(itemDescription.classList.contains('active')).toBeTrue();
  });
});
