import 'jquery-slimscroll';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router'; // <-- ¡Importa RouterModule!

// Importa el array de rutas desde tu archivo layout.routes.ts
import { routes } from './layout.routes';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchPipe } from './pipes/search.pipe';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { HelperComponent } from './helper/helper.component';
import { NewWidgetModule } from './new-widget/widget.module';
import { HelperService } from './helper/helper.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    // Aquí es donde debes usar RouterModule.forChild() con tu array de rutas.
    // Esto es crucial para los módulos de carga perezosa y rutas hijas.
    RouterModule.forChild(routes), // <-- ¡Importante cambio aquí!
    LoadingBarRouterModule,
    NewWidgetModule
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    NavbarComponent,
    SearchPipe,
    HelperComponent
  ],
  providers: [
    HelperService
    // Tus guards (AppGuard, AuthService) no necesitan ser provistos aquí,
    // ya que están marcados con `providedIn: 'root'`.
  ]
})
export class LayoutModule {
}