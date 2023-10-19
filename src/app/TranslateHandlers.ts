import { HttpClient } from '@angular/common/http';
import {  TranslateCompiler, MissingTranslationHandler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class JSONPointerCompiler extends TranslateCompiler {

  /*
  * Needed by ngx-translate
  */
  public compile(value: string, lang: string): string {
    return value;
  }

  /*
  * Triggered once from TranslateCompiler
  * Initiates recurive this.parseReferencePointers()
  * Returns modified translations object for ngx-translate to process
  */
  public compileTranslations(translations: any, lang: string) {
    this.parseReferencePointers(translations, translations);
    return translations;
  }

  /*
   * Triggered once from this.compileTranslations()
   * Recursively loops through an object,
   * replacing any property value that has a string starting with "@APP_CORE." with the APP_CORE global string definition.
   * i.e. @APP_CORE.LOCATION.OVERVIEW becomes Location Overview
   */
  private parseReferencePointers(currentTranslations: any, masterLanguageFile: any) {
    Object.keys(currentTranslations).forEach((key) => {
      if (currentTranslations[key] !== null && typeof currentTranslations[key] === 'object') {
        this.parseReferencePointers(currentTranslations[key], masterLanguageFile);
        return;
      }
      if (typeof currentTranslations[key] === 'string') {
        if (currentTranslations[key].includes("@:")) {
          let replacementProperty = this.getDescendantPropertyValue(masterLanguageFile, currentTranslations[key].substring(2));
          let i = 0;

          if (!replacementProperty) {
            //Incase invalid referer or missing translation
            console.error('Missing translation: ', currentTranslations[key])
          }

          while (replacementProperty.includes("@:")) {
            i++;
            const tryProp = replacementProperty;
            replacementProperty = this.getDescendantPropertyValue(masterLanguageFile, tryProp.substring(2));

            if (tryProp === replacementProperty) {
              console.error('Translation loop for key:', tryProp)
              break
            };
          }
          if (replacementProperty) {
            currentTranslations[key] = replacementProperty;
          } else {
            currentTranslations[key] = currentTranslations[key];
          }
        }
      }
    });
  }

  /*
   * Takes a string representation of an objects dot notation
   * i.e. "APP_CORE.LABEL.LOCATION"
   * and returns the property value of the input objects property
   */
  private getDescendantPropertyValue(obj: any, desc: any) {
    const arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
  }

}

export class CosMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: any) {
    if (params.interpolateParams && params.interpolateParams.default) {
      return params.interpolateParams.default
    }
    return params.key
  }
}
