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
  countries = countries;
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
    public app:AppService) {
    this.PublicGroupService.reset();
    this.groups$ = combineLatest([this.route.queryParams, this.searchString$]).pipe(
      switchMap(([queryParams, search]) => {
        console.log(search);
        PublicGroupService.reset();
        if (search) {
          PublicGroupService.setParam('search', search);
        }
        Object.entries(queryParams).forEach((param) => {
          PublicGroupService.setParam(param[0], param[1]);
        })
        return PublicGroupService.loadItems();
      }
      ));
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
  }
  /*TODO add functionalities*/
  setCountry (country: string) {
    this.filters.country = country;
  }

  setLanguage(language: string) {
    this.filters.language = language;
  }
}
