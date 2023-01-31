import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cosEllipsis'
})
export class CosEllipsisPipe implements PipeTransform {

  transform(value: string, ...args: any): string {
      let limit = args['limit']
      if (!value || typeof value !== 'string') return value;

      if (!args['limit']) {
          limit = 128
      }

      return value.substring(0, limit) + (value.length > limit ? '...' : '');
  }

}
