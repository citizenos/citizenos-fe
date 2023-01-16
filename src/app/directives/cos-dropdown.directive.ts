import { Directive, ElementRef, Input, HostListener, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[cosDropdown]'
})
export class CosDropdownDirective implements OnDestroy {
  @Input() cosDropdown: undefined; // The text for the tooltip to display
  @Input() cosDropdownMobile!: any;

  constructor(private elem: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('click')
  onClick() {
    const elem = this.elem.nativeElement;
    if (this.cosDropdownMobile == 'true') {
      this.renderer.addClass(elem, 'dropdown_active');

      if (elem.classList.contains('dropdown_selector')) {
        this.renderer.removeClass(elem, 'dropdown_active');
      }
    } else if (elem.classList.contains('dropdown_active')) {
      this.renderer.removeClass(elem, 'dropdown_active');
    } else {
      this.renderer.addClass(elem, 'dropdown_active');
    }

    this.renderer.addClass(elem, 'active_recent');
  }

  @HostListener('document:click', ['$event'])
  clickout() {
    const elem = this.elem.nativeElement;
    if (!elem.classList.contains('active_recent')) {
      this.renderer.removeClass(elem, 'dropdown_active');
    }

    this.renderer.removeClass(elem, 'active_recent');
  }

  ngOnDestroy(): void {
  }

  @HostListener('mouseenter', ['$event.target'])
  mouseenter(targetElem: any) {
    const dropdownWithDescription = this.elem.nativeElement.getElementsByClassName('dropdown with_description')[0];
    if (dropdownWithDescription) {
      const elementMouseEnterHandler = (item: Element) => {
        const elementClasses = item.classList;
        let itemClass;

        // find the "item_*" class name to use it to highlight the right description
        for (let i = 0; i < elementClasses.length; i++) {
          if (elementClasses[i].indexOf('item_') === 0) {
            itemClass = elementClasses[i];
            break;
          }
        }
        if (itemClass) {
          // Add active class to the dropdown items
          for (let j = 0; j < dropdownItems.length; j++) {
            dropdownItems[j].classList.remove('active');
          }
          elementClasses.add('active');

          // Add active to the relevant description
          const itemDescriptions = dropdownWithDescription.getElementsByClassName('item_description');
          for (let k = 0; k < itemDescriptions.length; k++) {
            const itemDescriptionClassList = itemDescriptions[k].classList;
            if (itemDescriptionClassList.contains(itemClass)) {
              itemDescriptionClassList.add('active');
            } else {
              itemDescriptionClassList.remove('active');
            }
          }
        }
      };

      const dropdownItems = dropdownWithDescription.getElementsByClassName('dropdown_item');
      for (let i = 0; i < dropdownItems.length; i++) {
        dropdownItems[i].addEventListener('mouseenter', elementMouseEnterHandler(dropdownItems[i]));
      }
      /*
        const elementClasses = this.elem.nativeElement.classList;
        let itemClass;

        // find the "item_*" class name to use it to highlight the right description
        for (var i = 0; i < elementClasses.length; i++) {
            if (elementClasses[i].indexOf('item_') === 0) {
                itemClass = elementClasses[i];
                break;
            }
        }
        if (itemClass) {
            // Add active class to the dropdown items
            for (var j = 0; j < dropdownItems.length; j++) {
                dropdownItems[j].classList.remove('active');
            }
            elementClasses.add('active');

            // Add active to the relevant description
            var itemDescriptions = dropdownWithDescription.getElementsByClassName('item_description');
            for (var k = 0; k < itemDescriptions.length; k++) {
                var itemDescriptionClassList = itemDescriptions[k].classList;
                if (itemDescriptionClassList.contains(itemClass)) {
                    itemDescriptionClassList.add('active');
                } else {
                    itemDescriptionClassList.remove('active');
                }
            }
        }*/
    }
  }
  /*
    setTimeout(() => {
      var dropdownWithDescription = elem[0].getElementsByClassName('dropdown with_description')[0];
      if (dropdownWithDescription) {
          var dropdownItems = dropdownWithDescription.getElementsByClassName('dropdown_item');

          var elementMouseEnterHandler = function () {
              var elementClasses = this.classList;
              var itemClass;

              // find the "item_*" class name to use it to highlight the right description
              for (var i = 0; i < elementClasses.length; i++) {
                  if (elementClasses[i].indexOf('item_') === 0) {
                      itemClass = elementClasses[i];
                      break;
                  }
              }
              if (itemClass) {
                  // Add active class to the dropdown items
                  for (var j = 0; j < dropdownItems.length; j++) {
                      dropdownItems[j].classList.remove('active');
                  }
                  elementClasses.add('active');

                  // Add active to the relevant description
                  var itemDescriptions = dropdownWithDescription.getElementsByClassName('item_description');
                  for (var k = 0; k < itemDescriptions.length; k++) {
                      var itemDescriptionClassList = itemDescriptions[k].classList;
                      if (itemDescriptionClassList.contains(itemClass)) {
                          itemDescriptionClassList.add('active');
                      } else {
                          itemDescriptionClassList.remove('active');
                      }
                  }
              }
          };

          for (var i = 0; i < dropdownItems.length; i++) {
              dropdownItems[i].addEventListener('mouseenter', elementMouseEnterHandler.bind(dropdownItems[i]));
          }
      }
    })*/
}
