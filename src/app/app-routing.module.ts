import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';

const routes: Routes = [
  {
    path: ':lang',
    children: [
      {path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
      {path: '', component: HomeComponent},
      {path: ':category', component: HomeComponent},
      {path: 'my', children: [
        {path: 'topics', loadChildren: () => import('./my-topics/my-topics.module').then((m) => {console.log('MODULE', m); return m.MyTopicsModule})},
        {path: 'groups', loadChildren: () => import('./my-groups/my-groups.module').then(m => m.MyGroupsModule)}
      ]},
      {path: 'public', children: [
        {path: 'topics', loadChildren: () => import('./public-topics/public-topics.module').then(m => m.PublicTopicsModule)},
        {path: 'groups', loadChildren: () => import('./public-groups/public-groups.module').then(m => m.PublicGroupsModule)}
      ]}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
export const ArrayOfComponents = [HomeComponent]
