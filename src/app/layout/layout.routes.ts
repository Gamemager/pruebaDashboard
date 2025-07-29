import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AppGuard } from '../app.guard'; // <-- ¡Asegúrate de que la ruta sea correcta!

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard', // Ruta completa: /app/dashboard
        // ¡VERIFICA ESTA RUTA DE IMPORTACIÓN! Debe ser relativa desde layout.routes.ts hasta dashboard.module.ts
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AppGuard],
        data: { roles: ['superadmin', 'moderator', 'support'] }
      },
      {
        path: 'analytics',
        loadChildren: () => import('../pages/analytics/analytics.module').then(m => m.AnalyticsModule),
        canActivate: [AppGuard],
        // Ejemplo: 'analytics' puede ser accesible por todos los roles autenticados
        data: { roles: ['superadmin', 'moderator', 'support'] }
      },
      { path: 'register', 
        loadChildren: () => import('../pages/register/register.module').then(m => m.RegisterModule),
        data: { roles: ['superadmin'] } 
      },
      {
        path: 'visits',
        loadChildren: () => import('../pages/visits/visits.module').then(m => m.VisitsModule),
        canActivate: [AppGuard],
        // Ejemplo: 'visits' puede ser solo para SuperAdmin y Moderador
        data: { roles: ['superadmin', 'moderator'] }
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AppGuard],
        // Ejemplo: 'profile' es accesible por todos los roles autenticados, o solo por roles específicos
        data: { roles: ['superadmin', 'moderator', 'support'] } // O solo ['Support'] si fuera un perfil de soporte
      },
      {
        path: 'forms',
        loadChildren: () => import('../pages/forms/forms.module').then(m => m.FormModule),
        canActivate: [AppGuard],
        // Ejemplo: 'forms' podría ser solo para SuperAdmin
        data: { roles: ['superadmin'] }
      },
      {
        path: 'extra',
        loadChildren: () => import('../pages/extra/extra.module').then(m => m.ExtraModule),
        canActivate: [AppGuard],
        // Ejemplo: 'extra' podría ser solo para SuperAdmin y Moderador
        data: { roles: ['superadmin', 'Moderator'] }
      },
      {
        path: 'maps',
        loadChildren: () => import('../pages/maps/maps.module').then(m => m.MapsModule),
        canActivate: [AppGuard],
        // Ejemplo: 'maps' podría ser solo para SuperAdmin y Soporte
        data: { roles: ['superadmin', 'support'] }
      },
      // Descomenta y agrega los roles para tus otras rutas como 'charts', 'ecommerce', etc.
      // {
      //   path: 'charts',
      //   loadChildren: () => import('../pages/charts/charts.module').then(m => m.ChartsModule),
      //   canActivate: [AppGuard],
      //   data: { roles: ['SuperAdmin'] } // Ajusta según sea necesario
      // },
      // {
      //   path: 'ecommerce',
      //   loadChildren: () => import('../pages/ecommerce/ecommerce.module').then(m => m.EcommerceModule),
      //   canActivate: [AppGuard],
      //   data: { roles: ['SuperAdmin', 'Moderator'] } // Ajusta según sea necesario
      // },
    ]
  }
];

// export const ROUTES = RouterModule.forChild(routes); // No necesitas RouterModule.forChild aquí si lo importas como routes directamente en LayoutModule

export { routes }; // Exporta el array de rutas directamente