import { Group } from 'src/app/interfaces/group';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, map, BehaviorSubject, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { countries } from 'src/app/services/country.service';
import { languages } from 'src/app/services/language.service';
import { PublicGroupService } from 'src/app/services/public-group.service';
import { GroupCreateComponent } from 'src/app/group/components/group-create/group-create.component';
import { DialogService } from 'src/app/shared/dialog';
import { AppService } from 'src/app/services/app.service';
import { trigger, state, style } from '@angular/animations';
import { Country } from 'src/app/interfaces/country';
import { Language } from 'src/app/interfaces/language';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        'maxHeight': '450px',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        'maxHeight': '50px',
        transition: '0.2s ease-in-out max-height'
      }))
    ])]
})
export class GroupsComponent implements OnInit {
  allGroups$: Group[] = [];
  groups$ = of(<Group[] | any[]>[]);
  moreFilters = false;
  searchInput = '';
  searchString$ = new BehaviorSubject('');
  mobileFilters:any = {
    visibility: false,
    my_engagement: false,
    category: false,
    order: false,
    country: false,
    language: false
  }
  mobileFiltersList = false;
  visibility = [''];
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
  /*topicFilters = {
    category: this.FILTERS_ALL,
    status: this.FILTERS_ALL,
    country: this.FILTERS_ALL,
    language: this.FILTERS_ALL
  };*/

  filters = {
    country: '',
    language: ''
  }

  constructor(private dialog: DialogService,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    public GroupService: GroupService,
    public PublicGroupService: PublicGroupService,
    public app: AppService) {
    this.PublicGroupService.reset();
    this.groups$ = combineLatest([this.route.queryParams, this.searchString$]).pipe(
      switchMap(([queryParams, search]) => {
        PublicGroupService.reset();
        this.allGroups$ = [];
        if (search) {
          PublicGroupService.setParam('name', search);
        }
        Object.entries(queryParams).forEach((param) => {
          PublicGroupService.setParam(param[0], param[1]);
        })
        return PublicGroupService.loadItems();
      }), map(
        (newgroups: any) => {
          this.allGroups$ = this.allGroups$.concat(newgroups);
          return this.allGroups$;
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

  searchCountry(event: any) {
    this.countrySearch$.next(event);
  }

  searchLanguage(event: any) {
    this.languageSearch$.next(event);
  }

  loggedIn() {
    return this.AuthService.loggedIn$.value;
  }

  ngOnInit(): void {
  }

  createGroup() {
    this.dialog.open(GroupCreateComponent, {
      data: {
        visibility: this.GroupService.VISIBILITY.public
      }
    })
  }

  doSearch(search: string) {
    this.searchString$.next(search);
  }

  doOrder(orderBy: string, order: string) {
    this.allGroups$ = [];
    this.PublicGroupService.doOrder(orderBy, order)
  }

  closeMobileFilter () {
    const filtersShow = Object.entries(this.mobileFilters).find(([key, value]) => {
      return !!value;
    })
    if (filtersShow)
      this.mobileFilters[filtersShow[0]] = false;
  }

  showMobileOverlay () {
    const filtersShow = Object.entries(this.mobileFilters).find(([key, value]) => {
      return !!value;
    })
    if (filtersShow) return true;

    return false;
  }

  doClearFilters() {
    this.filters = {
      country: '',
      language: ''
    }
    this.PublicGroupService.setParam('visibility', null);
    this.PublicGroupService.setParam('favourite', null);
    this.searchInput = '';
    this.searchString$.next('');
    this.setLanguage('');
    this.setLanguage('');
    this.languageSearch = '';
    this.countrySearch = '';
  }
  /*TODO add functionalities*/
  setCountry(country: string) {
    if (typeof country !== 'string') {
      country = '';
    }

    this.countrySearch$.next(country);
    this.countrySearch = country;
    this.allGroups$ = [];
    this.filters.country = country;
    this.PublicGroupService.setParam('offset', 0);
    this.PublicGroupService.setParam('country', country);
    this.PublicGroupService.loadItems();
  }

  setLanguage(language: string) {
    if (typeof language !== 'string') {
      language = '';
    }
    this.languageSearch$.next(language);
    this.languageSearch = language;
    this.allGroups$ = [];
    this.filters.language = language;
    this.PublicGroupService.setParam('offset', 0)
    this.PublicGroupService.setParam('language', language || null);
    this.PublicGroupService.loadItems();
  }

  loadPage(page: any) {
    this.allGroups$ = [];
    this.PublicGroupService.loadPage(page);
  }
}
