import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes, UrlSegment } from '@angular/router';
import { GroupCreateComponent } from '../group/components/group-create/group-create.component';
import { MyGroupsComponent } from './my-groups.component';
import { CanDeactivateBlockNavigationIfChange } from '../shared/pending-changes.guard';

const routes: Routes = [
  { path: 'create', component: GroupCreateComponent, canDeactivate:[CanDeactivateBlockNavigationIfChange]},
  {
    path: '', component: MyGroupsComponent, children: [
      {
        path: ':groupId', children: [
          {
            path: 'settings', children: [
            ]
          },
          /*{
            path: 'invite', children: [
              { path: '', component: TopicInviteDialogComponent }
            ]
          },
          */
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MyGroupsRoutingModule {
  constructor(router: Router) {
  }
}
