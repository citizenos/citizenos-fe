import { Injectable, APP_INITIALIZER, Directive, Input, ElementRef, HostListener, OnDestroy, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment'; //path to your environment files
import * as EasyMDE from 'easymde';
import { marked } from 'marked';
@Directive({
  selector: '[cosmarkdown]'
})
export class MarkdownDirective implements OnDestroy {

  @Input() item: string = ''; // The text for the tooltip to display
  @Input() limit: number = 100; // Optional delay input, in m
  @Input() cosMarkdownTranslateCharacterStatusKey: any;
  CHAR_COUNTER_ELEMENT_CLASS_NAME = 'charCounter';
  curLength = 0;
  easymde;

  config: any = {
    placeholder: this.el.nativeElement.attrs.placeholder,
    toolbar: [
      {
        name: 'bold',
        action: EasyMDE.toggleBold,
        className: 'fa fa-bold',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_BOLD'),
      },
      {
        name: 'italic',
        action: EasyMDE.toggleItalic,
        className: 'fa fa-italic',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_ITALIC'),
      },
      {
        name: 'strikethrough',
        action: EasyMDE.toggleStrikethrough,
        className: 'fa fa-strikethrough',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_STRIKETHROUGH'),
      },
      '|',
      {
        name: 'ordered-list	',
        action: EasyMDE.toggleOrderedList,
        className: 'fa fa-list-ol',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_ORDERED_LIST'),
      },
      {
        name: 'unordered-list	',
        action: EasyMDE.toggleUnorderedList,
        className: 'fa fa-list-ul',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_UNORDERED_LIST'),
      },
      {
        name: 'preview	',
        action: EasyMDE.togglePreview,
        className: 'fa fa-eye no-disable',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_PREVIEW'),
      }
    ],
    preview: true,
    blockStyles: {
      italic: '_'
    },
    status: [{
      className: this.CHAR_COUNTER_ELEMENT_CLASS_NAME,
      defaultValue: this.updateCharacterCount,
      onUpdate: this.updateCharacterCount
    }],
    element: this.el.nativeElement,
    initialValue: this.item
  };
  constructor(private el: ElementRef, private Translate: TranslateService, markdown: MarkdownService) {
    this.easymde = new EasyMDE(this.config);
  }

  ngOnDestroy(): void {
  }

  getCharLength() {
    let curLength = 0;
    if (this.item && this.item.length) {
      curLength = this.item.length;
    }

    return curLength;
  };


  updateCharacterCount() {
    if (this.cosMarkdownTranslateCharacterStatusKey && this.limit) {
      this.el.nativeElement.innerHTML = this.Translate.instant(this.cosMarkdownTranslateCharacterStatusKey, {
        numberOfCharacters: this.limit,
      }) + ' (' + (this.limit - this.getCharLength()) + ')';
    }
  };


  enforceMaxLength(cm: any, change: any) {
    const maxLength = cm.getOption('maxLength');
    if (maxLength && change.update) {
      let str = change.text.join('\n');
      let delta = str.length - (cm.indexFromPos(change.to) - cm.indexFromPos(change.from));
      if (delta <= 0) {
        return true;
      }
      delta = cm.getValue().length + delta - maxLength;
      if (delta > 0) {
        str = str.substr(0, str.length - delta);
        change.update(change.from, change.to, str.split('\n'));
      }
    }
    return true;
  };
  /*
  scope.$watch('limit', function(newVal, oldVal) {
      if (newVal) {
        easymde.codemirror.setOption('maxLength', newVal);
        if (easymde.gui.statusbar) {
          var statusBarElement = easymde.gui.statusbar.getElementsByClassName(CHAR_COUNTER_ELEMENT_CLASS_NAME)[0];
          if (statusBarElement) {
            updateCharacterCount(statusBarElement);
          }
        }
      }
    });*/
  /*
  easymde.codemirror.on('beforeChange', enforceMaxLength);
  easymde.codemirror.on('change', function() {
      curLength = easymde.value().length;
      scope.$apply(function () {
        scope.item = easymde.value();
      });
    });
  */
}

import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  transform(input: string, ...args: unknown[]): unknown {
    const renderer = {
      code: (text: string) => `<code>${text}</code>`
    }
    marked.use({ renderer });
    const html = marked(input);
    /*div.innerHTML = $filter('linky')(html, '_blank');
            return $sce.getTrustedHtml(div.textContent);*/
    return html;
  }

}


@Injectable({
  providedIn: 'root'
})
export class MarkdownService {

  constructor() { }
  // Gets a value of specified property in the configuration file
  get() {
    return EasyMDE;
  }
}

export function MarkdownFactory(markdown: MarkdownService) {
  return () => markdown.get();
}

export function init() {
  return {
    provide: APP_INITIALIZER,
    useFactory: MarkdownFactory,
    deps: [MarkdownService],
    multi: true
  }
}

const MarkdownModule = {
  init: init,
  imports: [MarkdownPipe]
}

export { MarkdownModule };
