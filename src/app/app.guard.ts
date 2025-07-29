import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from './pages/login/login.service';
import {Injectable} from '@angular/core';
import {AuthRoleServiceService, UserRole } from './services/auth-role-service.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private AuthRoleServiceService: AuthRoleServiceService,
    private toastr: ToastrService // Asegúrate de importar ToastrService desde 'ngx-toastr' o el paquete que estés usando
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean { // canActivate DEBE devolver un booleano o una Promise/Observable<boolean>

    console.log('AppGuard - Verificando autenticación...');
    if (!this.AuthRoleServiceService.isLoggedIn()) {
      console.log('AppGuard - Usuario no autenticado. Redirigiendo al login.');
      this.toastr.warning('Necesitas iniciar sesión para acceder a esta página.');
      this.router.navigate(['/login']);
      return false; // Acceso denegado
    }
    const requiredRoles = route.data['roles'] as UserRole[];
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('AppGuard - Ruta sin roles específicos. Acceso permitido para usuario autenticado.');
      return true;
    }
    if (this.AuthRoleServiceService.hasAnyRole(requiredRoles)) {
      console.log(`AppGuard - Usuario con rol '${this.AuthRoleServiceService.getCurrentUserRole()}' tiene acceso a roles requeridos: ${requiredRoles.join(', ')}. Acceso permitido.`);
      return true; // Acceso permitido
    } else {
      // El usuario está autenticado, pero no tiene el rol necesario
      console.log(`AppGuard - Usuario con rol '${this.AuthRoleServiceService.getCurrentUserRole()}' no tiene acceso a roles requeridos: ${requiredRoles.join(', ')}. Acceso denegado.`);
      this.toastr.error('No tienes los permisos necesarios para acceder a esta sección.');
      // Puedes redirigir a una página de "acceso denegado" o al dashboard principal
      this.router.navigate(['/login']); // O '/acceso-denegado' si tienes una
      return false; // Acceso denegado
    }





  }
}
