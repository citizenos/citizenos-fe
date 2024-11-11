import { MarkdownDirective } from './markdown.directive';
import { ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/app/shared/dialog';
import { EnvironmentInjector } from '@angular/core';
import { MarkdownLinkDialogComponent } from './components/markdown-link-dialog/markdown-link-dialog.component';
import { of } from 'rxjs';

describe('MarkdownDirective', () => {

  describe('MarkdownDirective', () => {
    let directive: MarkdownDirective;
    let elementRef: ElementRef;
    let translateService: TranslateService;
    let dialogService: DialogService;
    let environmentInjector: EnvironmentInjector;

    beforeEach(() => {
      elementRef = new ElementRef(document.createElement('textarea'));
      translateService = jasmine.createSpyObj('TranslateService', ['instant']);
      dialogService = jasmine.createSpyObj('DialogService', ['open']);
      environmentInjector = jasmine.createSpyObj('EnvironmentInjector', ['get']);

      directive = new MarkdownDirective(elementRef, translateService, dialogService, environmentInjector);
    });

    it('should create an instance', () => {
      expect(directive).toBeTruthy();
    });

    it('should initialize EasyMDE with the correct configuration', () => {
      expect(directive.easymde).toBeDefined();
      expect(directive.easymde.options.spellChecker).toBe(false);
    });

    it('should update character count correctly', () => {
      const el = document.createElement('div');
      directive.item = 'test';
      directive.limit = 10;
      directive.cosMarkdownTranslateCharacterStatusKey = 'CHAR_COUNT';
      (translateService.instant as jasmine.Spy).and.returnValue('Characters left');

      directive.updateCharacterCount(el);

      expect(el.innerHTML).toBe('Characters left (6)');
    });

    it('should emit itemChange on content change', () => {
      spyOn(directive.itemChange, 'emit');
      directive.easymde.value('new content');
      directive.easymde.codemirror.emit('change');

      expect(directive.itemChange.emit).toHaveBeenCalledWith('new content');
    });

    it('should toggle link dialog and insert link', () => {
      const selectedText = 'example';
      const linkData = { link: 'http://example.com', linktext: 'example' };
      dialogService.open({
        afterClosed: () => of(linkData)
      } as any);

      directive.easymde.codemirror.setSelection = jasmine.createSpy();
      directive.easymde.codemirror.replaceSelection = jasmine.createSpy();
      directive.easymde.codemirror.getCursor = jasmine.createSpy().and.returnValue({ ch: 0 });
      directive.easymde.codemirror.focus = jasmine.createSpy();

      directive.toggleLink()();

      expect(dialogService.open).toHaveBeenCalledWith(MarkdownLinkDialogComponent, { data: { selected: selectedText } });
      expect(directive.easymde.codemirror.replaceSelection).toHaveBeenCalledWith('[example](http://example.com)');
    });

    it('should set initial value on ngOnInit', () => {
      directive.item = 'initial content';
      directive.ngOnInit();

      expect(directive.easymde.value()).toBe('initial content');
    });

    it('should update value on ngOnChanges', () => {
      directive.item = 'updated content';
      directive.ngOnChanges();

      expect(directive.easymde.value()).toBe('updated content');
    });
  });
});
