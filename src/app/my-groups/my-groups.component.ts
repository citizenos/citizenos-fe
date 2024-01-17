import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, combineLatest, Observable, of, BehaviorSubject } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';
import { countries } from '../services/country.service';
import { languages } from '../services/language.service';
import { state, style, trigger } from '@angular/animations';
import { Country } from 'src/app/interfaces/country';
import { Language } from 'src/app/interfaces/language';

@Component({
  selector: 'my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        'maxHeight': '300px',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        'maxHeight': '50px',
        transition: '0.2s ease-in-out max-height'
      }))
    ])]
})
export class MyGroupsComponent implements OnInit {
  public wWidth = window.innerWidth;
  groupId = <string | null>null;
  groups$: Observable<Group[] | any[]> = of([]);
  allGroups$: Group[] = [];
  visibility = Object.values(this.GroupService.VISIBILITY);
  countrySearch = '';
  countrySearch$ = new BehaviorSubject('');
  countries = countries.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });

  countries$ = of(<Country[]>[]);
  countryFocus = false;

  languageSearch = '';
  languageSearch$ = new BehaviorSubject('');
  languages = languages.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });
  languages$ = of(<Language[]>[]);
  languageFocus = false;

  searchInput = '';
  searchString$ = new BehaviorSubject('');
  moreFilters = false;
  mobileFilters:any = {
    visibility: false,
    my_engagement: false,
    category: false,
    order: false,
    country: false,
    language: false
  }
  mobileFiltersList = false;
  filters = {
    country: '',
    language: ''
  }

  constructor(
    public app: AppService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public GroupService: GroupService,
    private router: Router,
    TranslateService: TranslateService,
  ) {

    this.groups$ = combineLatest([this.route.queryParams, this.searchString$]).pipe(
      switchMap(([queryParams, search]) => {
        GroupService.reset();
        if (search) {
          GroupService.setParam('search', search);
        }
        Object.entries(queryParams).forEach((param) => {
          GroupService.setParam(param[0], param[1]);
        })
        return GroupService.loadItems();
      }
      ));
    this.countries$ = this.countrySearch$.pipe(switchMap((string) => {
      const countries = this.countries.filter((country) => country.name.toLowerCase().indexOf(string.toLowerCase()) > -1);

      return [countries];
    }));

    this.languages$ = this.languageSearch$.pipe(switchMap((string) => {
      const languages = this.languages.filter((language) => language.name.toLowerCase().indexOf(string.toLowerCase()) > -1);

      return [languages];
    }));
  }

  showMobileOverlay () {
    const filtersShow = Object.entries(this.mobileFilters).find(([key, value]) => {
      return !!value;
    })
    if (filtersShow) return true;

    return false;
  }

  closeMobileFilter () {
    const filtersShow = Object.entries(this.mobileFilters).find(([key, value]) => {
      return !!value;
    })
    if (filtersShow)
      this.mobileFilters[filtersShow[0]] = false;
  }

  doClearFilters() {
    this.filters = {
      country: '',
      language: ''
    }
    this.searchInput = '';
    this.searchString$.next('');
    this.setCountry('');
    this.setLanguage('');
    this.languageSearch = '';
    this.countrySearch = '';
  }

  doSearch(search: string) {
    this.searchString$.next(search);
  }

  doOrder(orderBy: string, order: string) {
    this.allGroups$ = [];
    this.GroupService.doOrder(orderBy, order)
  }

  ngOnInit(): void {
  }

  onSelect(id: string) {
    // this.UserTopicService.filterTopics(id);
    this.router.navigate([], { relativeTo: this.route, queryParams: { filter: id } });
  }

  menuHidden() {
    if (window.innerWidth <= 750) {
      const parsedUrl = this.router.parseUrl(this.router.url);
      const outlet = parsedUrl.root.children[PRIMARY_OUTLET];
      const g = outlet?.segments.map(seg => seg.path) || [''];
      if (g.length === 3 && g[2] === 'groups') return false

      return true;
    }

    return false;
  }

  searchCountry(event: any) {
    this.countrySearch$.next(event);
  }

  searchLanguage(event: any) {
    this.languageSearch$.next(event);
  }

  setCountry(country: string) {
    if (typeof country !== 'string') {
      country = '';
    }

    this.countrySearch$.next(country);
    this.countrySearch = country;
    this.allGroups$ = [];
    this.filters.country = country;
    this.GroupService.setParam('offset', 0);
    this.GroupService.setParam('country', country);
    this.GroupService.loadItems();
  }

  setLanguage(language: string) {
    if (typeof language !== 'string') {
      language = '';
    }
    this.languageSearch$.next(language);
    this.languageSearch = language;
    this.allGroups$ = [];
    this.filters.language = language;
    this.GroupService.setParam('offset', 0)
    this.GroupService.setParam('language', language || null);
    this.GroupService.loadItems();
  }
  loadPage(page: any) {
    this.allGroups$ = [];
    this.GroupService.loadPage(page);
  }
}
