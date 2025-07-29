import { Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { AppGuard } from './app.guard';

export const ROUTES: Routes = [
  {
    path: '', redirectTo: 'app', pathMatch: 'full'
  },
  {
    path: 'app',
    canActivate: [AppGuard], // <-- Este guard ya asegura que el usuario esté logueado
    // Aquí puedes añadir una propiedad `data` si quieres que *todo* dentro de /app requiera un rol mínimo.
    // Por ejemplo, `data: { roles: ['SuperAdmin', 'Moderator', 'Support'] }`
    // Si no pones 'data' aquí, AppGuard solo verificará que el usuario esté autenticado.
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  // {
  //   path: 'register', data: { roles: ['superadmin'] }, // <-- Aquí puedes especificar roles si es necesario
  //    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)
  // },
  {
    path: 'error', component: ErrorComponent
  },
  {
    path: '**', component: ErrorComponent
  }
];