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
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import { trigger, state, style } from '@angular/animations';
import { Country } from 'src/app/interfaces/country';

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
  mobile_filters = {
    visibility: false,
    my_engagement: false,
    category: false,
    order: false,
    country: false,
    language: false
  }

  visibility = ['all'];
  categories = ['all', 'democracy'];
  countrySearch = '';
  countrySearch$ = new BehaviorSubject('');
  countries = countries;
  countries$ = of(<Country[]>[]);
  countryFocus = false;

  languages = languages;
  filters = {
    country: 'all',
    language: 'all'
  }
  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    public GroupService: GroupService,
    public PublicGroupService: PublicGroupService,
    public app: AppService) {
    this.PublicGroupService.reset();
    this.groups$ = combineLatest([this.route.queryParams, this.searchString$]).pipe(
      switchMap(([queryParams, search]) => {
        console.log(search);
        PublicGroupService.reset();
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
      const countries = this.countries.filter((country) => country.name.toLowerCase().indexOf(string) > -1);

      return [countries];
    }));

  }

  searchCountry(event: any) {
    this.countrySearch$.next(event);
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

  doClearFilters() {
    this.filters = {
      country: 'all',
      language: 'all'
    }
    this.searchInput = '';
    this.searchString$.next('');
  }
  /*TODO add functionalities*/
  setCountry(country: string) {
    console.log(country);
    this.countrySearch = country;
    this.allGroups$ = [];
    this.filters.country = country;
    this.PublicGroupService.setParam('offset', 0)
    this.PublicGroupService.setParam('country', country);
    this.PublicGroupService.loadItems();
  }

  setLanguage(language: string) {
    this.allGroups$ = [];
    this.filters.language = language;
    this.PublicGroupService.setParam('offset', 0)
    this.PublicGroupService.setParam('language', language);
    this.PublicGroupService.loadItems();
  }
}
