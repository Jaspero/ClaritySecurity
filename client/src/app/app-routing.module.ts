import {NgModule} from '@angular/core';
import {
  AngularFireAuthGuard,
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {LoginComponent} from './modules/login/login.component';
import {ModuleDefinitionComponent} from './modules/module-definition/module-definition.component';
import {DefinitionInstanceComponent} from './modules/module-definition/pages/definition-instance/definition-instance.component';
import {DefinitionOverviewComponent} from './modules/module-definition/pages/definition-overview/definition-overview.component';
import {ModuleInstanceComponent} from './modules/module-instance/module-instance.component';
import {InstanceOverviewComponent} from './modules/module-instance/pages/instance-overview/instance-overview.component';
import {InstanceSingleComponent} from './modules/module-instance/pages/instance-single/instance-single.component';
import {ResetPasswordComponent} from './modules/reset-password/reset-password.component';
import {SettingsComponent} from './modules/settings/settings.component';
import {LayoutComponent} from './shared/components/layout/layout.component';
import {HasClaimGuard} from './shared/guards/has-claim/has-claim.guard';
import {CanReadModuleGuard} from './shared/guards/can-read-module/can-read-module.guard';

const redirectUnauthorized = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [
      AngularFireAuthGuard,
      HasClaimGuard
    ],
    data: {
      authGuardPipe: redirectUnauthorized
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module')
            .then(mod => mod.DashboardModule)
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module')
            .then(mod => mod.SettingsModule)
      },
      {
        path: 'module-definition',
        loadChildren: () =>
          import('./modules/module-definition/module-definition.module')
            .then(mod => mod.ModuleDefinitionModule)
      },
      {
        path: 'm/:id',
        component: ModuleInstanceComponent,
        canActivate: [
          CanReadModuleGuard
        ],
        children: [
          {
            path: 'overview',
            component: InstanceOverviewComponent
          },
          {
            path: 'single/:id',
            component: InstanceSingleComponent
          }
        ]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module')
        .then(mod => mod.LoginModule),
    ...canActivate(redirectLoggedInTo(['/dashboard']))
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./modules/reset-password/reset-password.module')
        .then(mod => mod.ResetPasswordModule),
    ...canActivate(redirectLoggedInTo(['/dashboard']))
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
