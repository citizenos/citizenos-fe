import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'cosEtherpad'
})
export class EtherpadDirective {
  width;
  height;
  minWidth: any;
  minHeight: any;

  constructor(private element: ElementRef) {
    console.log(element)
    this.width = element.nativeElement.attr.width;
    this.height = element.nativeElement.attr.height;
    if (this.width && this.valueNotPercent(this.width)) {
      this.minWidth = parseFloat(this.width);
    }

    if (this.height && this.valueNotPercent(this.height)) {
      this.minHeight = parseFloat(this.height);
    }
  }

  valueNotPercent(value: any) {
    return (value + '').indexOf('%') < 0;
  };

  debounce(func: any, timeout = 300) {
    let timer:any;
    return (...args:any) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  receiveMessageHandler(e:any) {
    const msg = e.data;
    if (msg.name === 'ep_resize') {
      const width = msg.data.width;
      const height = msg.data.height;

      if (Number.isSafeInteger(width) && width > this.minWidth) {
        const newWidth = width + 'px';
        if (newWidth !== this.element.nativeElement.css('width')) {
          this.element.nativeElement.css('width', newWidth);
        }
      }

      if (Number.isSafeInteger(height) && height > this.minHeight) {
        const newHeight = height + 'px';
        if (newHeight !== this.element.nativeElement.css('height')) {
          this.element.nativeElement.css('height', newHeight);
        }
      }
    }
  };

  sendScrollMessage = this.debounce(() => {
    const targetWindow = this.element.nativeElement.contentWindow;

    let yOffsetExtra = 0; // Additional Y offset in case there is a floating header element
    let mobileHeader = window.document.getElementById('mobile_header');
    if (mobileHeader) {
      yOffsetExtra = parseFloat(window.getComputedStyle(mobileHeader)['height']);
    }

    const data = {
      scroll: {
        top: window.pageYOffset + yOffsetExtra,
        left: window.pageXOffset
      },
      frameOffset: this.getFrameOffset()
    };

    targetWindow.postMessage({
      name: 'ep_embed_floating_toolbar_scroll',
      data: data
    }, '*');

  }, 100);

  // As angular.element does not support $.offset(), copied it over from Jquery source.
  getFrameOffset() {
    var elem = this.element.nativeElement;

    // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    // Support: IE <=11 only
    // Running getBoundingClientRect on a
    // disconnected node in IE throws an error
    if (!elem.getClientRects().length) {
      return { top: 0, left: 0 };
    }

    const rect = elem.getBoundingClientRect();

    const doc = elem.ownerDocument;
    const docElem = doc.documentElement;
    const win = doc.defaultView;

    return {
      top: rect.top + win.pageYOffset - docElem.clientTop,
      left: rect.left + win.pageXOffset - docElem.clientLeft
    };
  };

  /*

$($window).on('message onmessage', receiveMessageHandler);
$($window).on('scroll resize', sendScrollMessage);

this.$on('$destroy', function () {
  // Don't leave handlers hanging...
  $($window).off('message onmessage', receiveMessageHandler);
  $($window).off('scroll resize', sendScrollMessage);
});
  */
}
