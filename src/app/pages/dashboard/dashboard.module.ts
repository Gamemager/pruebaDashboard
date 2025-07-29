// src/app/pages/dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module'; // Importa el módulo de ruteo
import { DashboardComponent } from './dashboard.component'; // Importa el componente

@NgModule({
  declarations: [
    DashboardComponent // Declara el componente aquí
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule // Importa el módulo de ruteo
  ]
})
export class DashboardModule { }
