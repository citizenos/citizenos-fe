import { DialogService } from 'src/app/shared/dialog';
import {
  Directive,
  Input,
  ElementRef,
  OnDestroy,
  EventEmitter,
  Output,
  inject,
  EnvironmentInjector,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import EasyMDE from 'easymde';
import { MarkdownLinkDialogComponent } from './components/markdown-link-dialog/markdown-link-dialog.component';
@Directive({
  selector: '[cosmarkdown]',
})
export class MarkdownDirective implements OnDestroy {
  @Input() item = ''; // The text for the tooltip to display
  @Input() initialValue?: string | null = null;
  @Output() itemChange = new EventEmitter<string>();
  @Input() limit: number = 100; // Optional delay input, in m
  @Input() placeholder?: string;
  @Input('cosmarkdowntranslatecharacterstatuskey')
  cosMarkdownTranslateCharacterStatusKey: any;
  CHAR_COUNTER_ELEMENT_CLASS_NAME = 'charCounter';
  curLength = 0;
  easymde: any;

  config: any = {
    spellChecker: false,
    toolbar: [
      {
        name: 'write',
        text: this.Translate.instant('MDEDITOR_TOOLTIP_WRITE'),
        className: 'no-disable tab-active',
        action: (editor: any) => {
          if (editor.isPreviewActive()) {
            EasyMDE.togglePreview(editor);
            editor.toolbarElements.write.classList.add('tab-active');
          }
        },
        title: this.Translate.instant('MDEDITOR_TOOLTIP_WRITE'),
      },
      {
        name: 'preview',
        className: 'no-disable',
        text: this.Translate.instant('MDEDITOR_TOOLTIP_PREVIEW'),
        action: (editor: any) => {
          if (!editor.isPreviewActive()) {
            EasyMDE.togglePreview(editor);
            console.log('PREVIEW');
            editor.toolbarElements.write.classList.remove('tab-active');
          }
        },
        title: this.Translate.instant('MDEDITOR_TOOLTIP_PREVIEW'),
      },
      {
        name: 'hyperlink',
        action: this.toggleLink(),
        className: 'fa md-right fa-link',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_HYPERLINK'),
      },
      '|',
      {
        name: 'unordered-list	',
        action: EasyMDE.toggleUnorderedList,
        className: 'fa md-right fa-list-ul',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_UNORDERED_LIST'),
      },
      {
        name: 'ordered-list	',
        action: EasyMDE.toggleOrderedList,
        className: 'fa md-right fa-list-ol',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_ORDERED_LIST'),
      },
      '|',
      {
        name: 'strikethrough',
        action: EasyMDE.toggleStrikethrough,
        className: 'fa md-right fa-strikethrough',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_STRIKETHROUGH'),
      },
      {
        name: 'italic',
        action: EasyMDE.toggleItalic,
        className: 'md-right fa fa-italic',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_ITALIC'),
      },
      {
        name: 'bold',
        action: EasyMDE.toggleBold,
        className: 'md-right fa fa-bold',
        title: this.Translate.instant('MDEDITOR_TOOLTIP_BOLD'),
      },
    ],
    preview: true,
    blockStyles: {
      unorderedListStyle: '-',
      italic: '_',
    },
    status: [
      {
        className: this.CHAR_COUNTER_ELEMENT_CLASS_NAME,
        defaultValue: (el: any) => {
          this.updateCharacterCount(el);
        },
        onUpdate: (el: any) => {
          this.updateCharacterCount(el);
        },
      },
    ],
    minHeight: '100px',
    element: this.el.nativeElement,
    initialValue: this.initialValue,
  };
  constructor(
    private el: ElementRef,
    private Translate: TranslateService,
    private dialog: DialogService,
    private injector: EnvironmentInjector
  ) {
    if (window.innerWidth < 560) {
      this.config['minHeight'] = '100px';
    }
    let placeholder =
      this.el.nativeElement.attributes.getNamedItem('placeholder')?.value;
    if (placeholder) {
      placeholder = this.Translate.instant(placeholder);
      this.config.placeholder = placeholder;
    }
    this.easymde = new EasyMDE(this.config);
    this.easymde.codemirror.on('beforeChange', (cm: any, change: any) => {
      const maxLength = cm.getOption('maxLength') || this.limit;
      if (maxLength && change?.update && change?.text.length) {
        let str = change.text.join('\n');
        let delta =
          str.length -
          (cm.indexFromPos(change.to) - cm.indexFromPos(change.from));
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
    });
    this.easymde.codemirror.on('change', () => {
      this.itemChange.emit(this.easymde.value());
    });
  }

  toggleLink() {
    return () => {
      const selected = this.easymde.codemirror.getSelection();
      const linkDialog = this.dialog.open(MarkdownLinkDialogComponent, {
        data: {
          selected,
        },
      });

      linkDialog.afterClosed().subscribe({
        next: (data) => {
          console.log(data);
          if (data) {
            if (!data.link) {
              return;
            }

            if (data.link.indexOf('http') === -1) {
              data.link = `http://${data.link}`;
            }

            const editor = this.easymde;
            if (!editor.codemirror || editor.isPreviewActive()) {
              return;
            }
            const cm = editor.codemirror;
            if (!cm || editor.isPreviewActive()) {
              return;
            }

            const end = '](#url#)'.replace('#url#', data.link);
            const startPoint = cm.getCursor('start');
            const endPoint = cm.getCursor('end');
            const text = `[${data.linktext || cm.getSelection()}${end}`;
            cm.replaceSelection(text);

            endPoint.ch = startPoint.ch + text.length + 1;
            cm.setSelection(endPoint, endPoint);
            cm.focus();
          }
        },
      });
    };
  }
  ngOnInit(): void {
    if (!this.initialValue) {
      this.initialValue = this.item;
    }
    this.easymde.value(this.initialValue);
  }

  ngOnDestroy(): void {}

  ngOnChanges(): void {
    if (this.item === this.initialValue) {
      this.easymde.value(this.initialValue);
    }
  }

  getCharLength() {
    let curLength = 0;
    if (this.item && this.item.length) {
      curLength = this.item.length;
    }

    return curLength;
  }

  updateCharacterCount(el: any) {
    if (this.cosMarkdownTranslateCharacterStatusKey && this.limit) {
      el.innerHTML =
        this.Translate.instant(this.cosMarkdownTranslateCharacterStatusKey, {
          numberOfCharacters: this.limit,
        }) +
        ' (' +
        (this.limit - this.getCharLength()) +
        ')';
    }
  }
}
