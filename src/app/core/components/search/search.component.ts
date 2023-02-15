import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { SearchService } from 'src/app/services/search.service';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  noResults = true;
  config: any;
  lnkDonate: string;
  searchInput:string = '';
  contexts = ['my', 'public'];
  models = ['groups', 'topics']
  //review
  searchResults:any = {};

  constructor(ConfigService: ConfigService, private Translate: TranslateService, private Search: SearchService, private AuthService: AuthService, public app: AppService) {
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
          limit: 5
        }
      ).pipe(take(1)).
      subscribe({
        next: (data) => {
          console.log(data.results)
          this.searchResults = data.results;
          this.app.showSearchResults=true;
          this.app.showNav = false;
          this.app.showSearchFiltersMobile = false;
          this.noResults = false;
          /*this.searchResults = result.data.data.results;
          this.searchResults.combined = [];
          this.app.app.showSearchResults = true;
          this.app.showNav = false;
          this.app.showSearchFiltersMobile = false;
          this.combineResults();*/
        }, error: (err) => {
          console.error('SearchCtrl', 'Failed to retrieve search results', err);
        }
      });
  };

  goToView(item:any, context?:any) {
    console.log(context)
    if (item) {
      this.app.showSearchResults = false;
      let model = 'topic';
      if (item.id === 'viewMore') {
        model = 'viewMore';
    //    return this.viewMoreResults(item.context, item.model);
      }

      if (item.hasOwnProperty('name')) {
        model = 'group';
      }

      if (model == 'topic') {
        if (this.AuthService.loggedIn$.value === true && context === 'my') {
          /*return this.$state.go(
            'my/topics/topicId',
            {
              topicId: item.id,
              filter: 'all'
            },
            {
              reload: true
            }
          );*/
        }
      /*  this.$state.go(
          'topics/view',
          {
            topicId: item.id
          },
          {
            reload: true
          }
        );*/
      } else if (model === 'group') {
      /*  if (this.sAuth.user.loggedIn && context === 'my') {
          return this.$state.go(
            'my/groups/groupId',
            {
              groupId: item.id,
              filter: 'grouped'
            },
            {
              reload: true
            }
          );*/
        }
        console.log('GO TO VIEW')
      /* this.$state.go(
          'public/groups/view',
          {
            groupId: item.id
          },
          {
            reload: true
          }
        );
      }*/
    }
  };

  closeSearchArea () {
    this.app.showSearchResults = false;
   // this.searchInput = null;
    this.searchResults.combined = [];
    this.app.showSearch = false;
};
}
