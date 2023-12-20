import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions, UrlSegment } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { PageUnauthorizedComponent } from './core/components/page-unauthorized/page-unauthorized.component';
import { authResolver } from './services/auth.service';

const options: ExtraOptions = {
  paramsInheritanceStrategy: 'always'
};

const routes: Routes = [
  {path: '', component: AppComponent},
  {
    path: ':lang', resolve: { user: authResolver },
    children: [
      { path: '401', component: PageUnauthorizedComponent },
      { path: '403', component: PageUnauthorizedComponent },
      { path: '404', component: PageNotFoundComponent },
      { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
      { path: 'topics', loadChildren: () => import('./topic/topic.module').then(m => m.TopicModule) },
      { path: 'groups', loadChildren: () => import('./group/group.module').then(m => m.GroupModule) },
      {
        path: 'my', canActivate: [AuthGuard], children: [
          { path: 'topics', loadChildren: () => import('./my-topics/my-topics.module').then((m) => m.MyTopicsModule) },
          { path: 'groups', loadChildren: () => import('./my-groups/my-groups.module').then(m => m.MyGroupsModule) }
        ]
      },
      {
        path: 'public', children: [
          { path: 'topics', loadChildren: () => import('./public-topics/public-topics.module').then(m => m.PublicTopicsModule) },
          { path: 'groups', loadChildren: () => import('./public-groups/public-groups.module').then(m => m.PublicGroupsModule) }
        ]
      },
      { path: 'error/401', component: PageNotFoundComponent },
      { path: 'error/404', component: PageNotFoundComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      {
        path: '', component: HomeComponent, children: [
          { path: ':category', component: HomeComponent },
        ]
      },
    ],
  },
  { path: '401', redirectTo: '/:lang/error/401' },
  { path: '404', redirectTo: '/:lang/error/404' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, options)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
export const ArrayOfComponents = [HomeComponent]
