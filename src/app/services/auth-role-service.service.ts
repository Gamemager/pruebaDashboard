import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define tus roles de forma estricta
export type UserRole = 'SuperAdmin' | 'Moderator' | 'Support' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthRoleServiceService {
  private userRoleSubject = new BehaviorSubject<UserRole>(null);
  public userRole$: Observable<UserRole> = this.userRoleSubject.asObservable();

  // Puedes añadir un BehaviorSubject para el objeto completo del usuario si lo necesitas en otros lugares
  private currentUserDataSubject = new BehaviorSubject<any | null>(null);
  public currentUserData$: Observable<any | null> = this.currentUserDataSubject.asObservable();

  constructor() {
    // Intenta cargar el rol y los datos del usuario al inicio
    const storedUserData = sessionStorage.getItem('user_data');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        this.userRoleSubject.next(userData.role as UserRole);
        this.currentUserDataSubject.next(userData);
      } catch (e) {
        console.error('Error parsing user data from sessionStorage', e);
        sessionStorage.removeItem('user_data'); // Limpiar si está corrupto
      }
    }
  }

  // --- MÉTODOS PÚBLICOS PARA GESTIONAR EL ESTADO DEL USUARIO ---

  // Este método será llamado por LoginService
  setUserSession(userData: { id: string; name: string; lastname: string; username: string; role: string; }): void {
    const role = userData.role as UserRole;
    this.userRoleSubject.next(role);
    this.currentUserDataSubject.next(userData);
    sessionStorage.setItem('user_data', JSON.stringify(userData)); // Asegúrate de guardar aquí también
    console.log('AuthRoleServiceService: User session set. Role:', role);
  }

  // Este método será llamado por LoginService al cerrar sesión o por errores de autenticación
  clearUserSession(): void {
    this.userRoleSubject.next(null);
    this.currentUserDataSubject.next(null);
    sessionStorage.removeItem('user_data');
    console.log('AuthRoleServiceService: User session cleared.');
  }

  getCurrentUserRole(): UserRole {
    return this.userRoleSubject.value;
  }

  getCurrentUserData(): any | null {
    return this.currentUserDataSubject.value;
  }

  isLoggedIn(): boolean {
    return this.userRoleSubject.value !== null;
  }

  isSuperAdmin(): boolean {
    return this.getCurrentUserRole() === 'SuperAdmin';
  }

  isModerator(): boolean {
    return this.getCurrentUserRole() === 'Moderator';
  }

  isSupport(): boolean {
    return this.getCurrentUserRole() === 'Support';
  }

  hasAnyRole(allowedRoles: UserRole[]): boolean {
    const userRole = this.getCurrentUserRole();
    if (!userRole) {
      return false;
    }
    return allowedRoles.includes(userRole);
  }
}