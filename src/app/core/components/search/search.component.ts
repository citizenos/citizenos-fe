import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { SearchService } from 'src/app/services/search.service';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, of, take } from 'rxjs';
@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  noResults = true;
  viewMoreInProgress = false;
  moreStr: string = '';
  config: any;
  lnkDonate: string;
  searchInput: string = '';
  contexts = ['my', 'public'];
  models = ['groups', 'topics']
  //review
  searchResults: any = {};

  constructor(
    ConfigService: ConfigService,
    private Translate: TranslateService,
    private Search: SearchService,
    private AuthService: AuthService,
    private router: Router,
    public app: AppService) {
    this.config = ConfigService.get('links');
    this.lnkDonate = this.config.donate[this.Translate.currentLang || this.Translate.getDefaultLang()];
  }

  ngOnInit(): void {
  }

  doSearch(str: string | null) {
    /* if (this.viewMoreInProgress) {
         return this.form.searchInput = this.moreStr;
     }
 */
    this.noResults = true;

    if (!str || str.length < 3) {
      return this.app.showSearchResults = false;
    }
    let include = ['public.topic', 'public.group'];

    if (this.AuthService.loggedIn$.value === true) {
      include = ['my.topic', 'my.group', 'public.topic', 'public.group'];
    }

    return this.Search
      .search(
        str,
        {
          include: include,
          limit: 2
        }
      ).pipe(debounceTime(200), distinctUntilChanged(), take(1)).
      subscribe({
        next: (data) => {
          this.searchResults = data.results;
          this.app.showSearchResults = true;
          this.app.showNav = false;
          this.app.showSearchFiltersMobile = false;
          this.noResults = false;
          /*this.searchResults = result.data.data.results;
          */
        }, error: (err) => {
          console.error('SearchCtrl', 'Failed to retrieve search results', err);
        }
      });
  };

  goToView(item: any, context?: any) {
    if (item) {
      this.app.showSearchResults = false;
      if (item.id === 'viewMore') {
        this.viewMoreResults(item.context || context, item.model);
        this.app.showSearchResults = true;
        return;
      }

      let model = 'topic';
      if (item.hasOwnProperty('name')) {
        model = 'group';
      }

      if (model == 'topic') {
        if (this.AuthService.loggedIn$.value === true && context === 'my') {
          this.router.navigate(['my/topics', item.id], { queryParams: { filter: 'all' } });
        }
        return this.router.navigate(['/topics', item.id]);
      } else if (model === 'group') {
        if (this.AuthService.loggedIn$.value === true && context === 'my') {
          return this.router.navigate(['my/groups', item.id], { queryParams: { filter: 'grouped' } });
        }
        return this.router.navigate(['/groups', item.id]);
      }
    }
    return;
  };

  closeSearchArea() {
    this.app.showSearchResults = false;
    // this.searchInput = null;
    this.app.showSearch = false;
  };

  viewMoreResults(context: string, model: string) {
    if (this.viewMoreInProgress) {
      return;
    } else {
      this.viewMoreInProgress = true;
      this.moreStr = this.searchInput;
    }

    if (context && model && this.searchResults[context][model].count > this.searchResults[context][model].rows.length - 1) { // -1 because the "viewMore" is added as an item that is not in the actual search result
      let include = context + '.' + model;
      if (model === 'topics') {
        include = context + '.topic';
      } else if (model === 'groups') {
        include = context + '.group';
      }

      this.Search
        .search(
          this.moreStr,
          {
            include: include,
            limit: 5,
            offset: this.searchResults[context][model].rows.length
          }
        )
        .pipe(take(1)).
        subscribe({
          next: (result) => {
            const moreResults = result.results;
            this.searchResults[context][model].count = moreResults[context][model].count;
            moreResults[context][model].rows.forEach((row:any) => {
              this.searchResults[context][model].rows.push(row);
            });
            this.viewMoreInProgress = false;
          },
          error: (err) => {
            console.error('SearchCtrl', 'Failed to retrieve search results', err);
            this.viewMoreInProgress = false;
          }
        });
    }
  };
}
