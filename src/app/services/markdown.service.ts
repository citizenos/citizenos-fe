import { Injectable, APP_INITIALIZER } from '@angular/core';
import EasyMDE from 'easymde';
import { marked } from 'marked';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'markdown'
})

export class MarkdownPipe implements PipeTransform {

  transform(input: string, ...args: unknown[]): unknown {
    const renderer = {
      code: (text: string) => `<code>${text}</code>`
    }
    marked.use({ renderer });
    const html = marked(input, {mangle: false, headerIds: false});
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
