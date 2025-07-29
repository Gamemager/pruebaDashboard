import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthRoleServiceService } from '../../services/auth-role-service.service'; // <-- ¡Tu servicio real!
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  //styleUrls: ['./dashboard.component.css'] // O .scss si usas Sass
})
export class DashboardComponent implements OnInit, OnDestroy {
  userName: string = 'Usuario';
  userRole: string = 'desconocido';
  private authSubscription: Subscription | undefined;

  constructor(private authRoleService: AuthRoleServiceService) { }

  ngOnInit(): void {
    this.authSubscription = this.authRoleService.currentUserData$.subscribe(userData => {
      if (userData) {
        this.userName = userData.name || userData.username || 'Usuario';
        this.userRole = userData.role || 'desconocido';
      } else {
        this.userName = 'Usuario';
        this.userRole = 'desconocido';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
