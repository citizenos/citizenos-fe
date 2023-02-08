import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions, UrlSegment } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { AuthGuard } from './auth/auth.guard';

const options: ExtraOptions = {
  paramsInheritanceStrategy: 'always'
};

const routes: Routes = [
  {
    path: ':lang',
    children: [
      {path: '', component: HomeComponent},
      {path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
      { path: 'topic', loadChildren: () => import('./topic/topic.module').then(m => m.TopicModule) },
      { path: 'groups', loadChildren: () => import('./group/group.module').then(m => m.GroupModule) },
      {path: 'topics', loadChildren: () => import('./topic/topic.module').then(m => m.TopicModule)},
      {path: ':category', component: HomeComponent},
      {path: 'my', canActivate: [AuthGuard], children: [
        {path: 'topics', loadChildren: () => import('./my-topics/my-topics.module').then((m) => m.MyTopicsModule)},
        {path: 'groups', loadChildren: () => import('./my-groups/my-groups.module').then(m => m.MyGroupsModule)}
      ]},
      {path: 'public', children: [
        {path: 'topics', loadChildren: () => import('./public-topics/public-topics.module').then(m => m.PublicTopicsModule)},
        {path: 'groups', loadChildren: () => import('./public-groups/public-groups.module').then(m => m.PublicGroupsModule)}
      ]}
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, options)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
export const ArrayOfComponents = [HomeComponent]
