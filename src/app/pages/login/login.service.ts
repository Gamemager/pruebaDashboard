import { AppConfig } from '../../app.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs'; // Quita BehaviorSubject de aquí, Auth Service lo maneja
import { catchError, tap, map } from 'rxjs/operators';
import { AuthRoleServiceService, UserRole } from '../../services/auth-role-service.service'; // <-- Importa AuthService

// Interfaz para la respuesta de la API de /token/access (datos de usuario decodificados)
interface UserDataResponse {
  user: {
    id: string;
    name: string;
    lastname: string;
    username: string;
    role: string; // Tu backend ya envía esto
  };
  message: string;
  success: boolean;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  config: any;
  _isFetching: boolean = false;
  _errorMessage: string = '';
  baseURLApi: string = '';

  // Ya no necesitas _isLoggedIn aquí, AuthService lo gestiona
  // isLoggedIn$ ya no es una propiedad de LoginService, la obtendrás de AuthService.isLoggedIn$

  constructor(
    private appConfig: AppConfig,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private AuthRoleServiceService: AuthRoleServiceService // <-- Inyecta AuthService
  ) {
    this.config = appConfig.getConfig();
    this.baseURLApi = environment.url;
    // this._isLoggedIn.next(this.hasLoggedInUser()); // Esto ya no es necesario aquí
  }

  get isFetching(): boolean {
    return this._isFetching;
  }

  set isFetching(val: boolean) {
    this._isFetching = val;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  set errorMessage(val: string) {
    this._errorMessage = val;
  }

  /**
   * Checks if a user is logged in based on the presence of user_data in sessionStorage.
   * Now delegates to AuthService.
   * @returns {boolean} True if a user is logged in, false otherwise.
   */
  isAuthenticated(): boolean {
    return this.AuthRoleServiceService.isLoggedIn(); // <-- Delega a AuthService
  }

  /**
   * Handles HTTP errors.
   * @param {HttpErrorResponse} error - The HTTP error.
   * @returns {Observable<never>} An observable that throws the error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.isFetching = false;
    let errorMessage = 'An unknown error occurred. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network or client error: ${error.error.message}`;
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);

      if (error.status === 401 || error.status === 403) {
        errorMessage = 'Unauthorized access or expired session. Please log in again.';
        this.AuthRoleServiceService.clearUserSession(); // <-- Limpia sesión usando AuthService
        this.router.navigate(['/login']);
      } else if (error.error && error.error.message) {
        errorMessage = Array.isArray(error.error.message)
          ? error.error.message.join('\n')
          : error.error.message;
      }
    }
    this.errorMessage = errorMessage;
    this.toastr.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Attempts to log in with user credentials.
   * @param {object} creds - Object with user, password, and rememberMe.
   * @returns {Observable<boolean>} An observable that emits true if login is successful.
   */
  loginUser(creds: { user: string; password: string; rememberMe: boolean }): Observable<boolean> {
    this.errorMessage = '';
    this.isFetching = true;

    // If not in backend mode, simulate login
    if (!this.config.isBackend) {
      // Simula el rol aquí para pruebas de frontend
      const simulatedRole: UserRole = creds.user === 'admin' ? 'SuperAdmin' : (creds.user === 'mod' ? 'Moderator' : 'Support');
      const mockUserData: UserDataResponse['user'] = {
        id: 'mock-id',
        name: 'Mock',
        lastname: 'User',
        username: creds.user,
        role: simulatedRole || 'Support' // Asegúrate de que el rol simulado sea uno de los definidos
      };
      this.AuthRoleServiceService.setUserSession(mockUserData); // <-- Usa AuthService para guardar la sesión
      this.receiveLogin();
      this.isFetching = false;
      return new Observable(observer => observer.next(true));
    }

    // 1. Perform POST to /admin/auth to send credentials and have the API set cookies.
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user: creds.user, password: creds.password, rememberMe: creds.rememberMe };

    return this.http.post<any>(`/admin/auth`, body, { headers, withCredentials: true }).pipe(
      tap((authRes: any) => {
        console.log('Authentication POST successful, attempting to get user data with GET /token/access...');

        // 2. Perform GET to /token/access to retrieve user data.
        this.http.get<UserDataResponse>(`/token/access`, { withCredentials: true }).pipe(
          tap(userDataResponse => {
            if (userDataResponse.success && userDataResponse.user) {
              this.AuthRoleServiceService.setUserSession(userDataResponse.user); // <-- Usa AuthService para guardar la sesión
              this.receiveLogin();
            } else {
              this.errorMessage = userDataResponse.message || 'Error getting user data.';
              this.toastr.error(this.errorMessage);
              this.AuthRoleServiceService.clearUserSession(); // <-- Limpia sesión usando AuthService
            }
          }),
          catchError(error => {
            console.error('Error fetching user data from /token/access (GET):', error);
            this.AuthRoleServiceService.clearUserSession(); // <-- Limpia sesión usando AuthService
            return this.handleError(error);
          })
        ).subscribe();
      }),
      map(() => true),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Attempts to refresh the access token.
   * Delegates session management to AuthService.
   * @returns {Observable<boolean>} An observable that emits true if refresh is successful.
   */
  refreshToken(): Observable<boolean> {
    this.errorMessage = '';
    this.isFetching = true;

    return this.http.get<any>(`/token/refresh`, { withCredentials: true }).pipe(
      tap(() => {
        console.log('Token refresh successful, attempting to get user data with GET /token/access...');
        this.http.get<UserDataResponse>(`/token/access`, { withCredentials: true }).pipe(
          tap(userDataResponse => {
            if (userDataResponse.success && userDataResponse.user) {
              this.AuthRoleServiceService.setUserSession(userDataResponse.user); // <-- Usa AuthService
              this.isFetching = false;
            } else {
              this.errorMessage = userDataResponse.message || 'Error getting user data after refresh.';
              this.toastr.error(this.errorMessage);
              this.AuthRoleServiceService.clearUserSession(); // <-- Limpia sesión
              this.isFetching = false;
              this.router.navigate(['/login']);
            }
          }),
          catchError(error => {
            console.error('Error fetching user data after refresh from /token/access (GET):', error);
            this.handleError(error);
            this.AuthRoleServiceService.clearUserSession(); // <-- Limpia sesión
            this.isFetching = false;
            this.router.navigate(['/login']);
            return throwError(() => new Error('Failed to get user data after token refresh.'));
          })
        ).subscribe();
      }),
      map(() => true),
      catchError(error => {
        this.handleError(error);
        this.AuthRoleServiceService.clearUserSession(); // <-- Limpia sesión
        this.router.navigate(['/login']);
        return throwError(() => new Error('Token refresh failed.'));
      })
    );
  }

  /**
   * Logs out the user.
   * Delegates session management to AuthService.
   * @param {boolean} silent - If true, does not show toastr or redirect.
   */
  logoutUser(silent: boolean = false): void {
    this.isFetching = true;

    this.http.delete(`/api/token/destroy`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error destroying tokens on backend:', error);
        if (!silent) {
          this.toastr.error('Could not completely log out on the server.');
        }
        return throwError(() => new Error('Failed to destroy tokens on backend.'));
      })
    ).subscribe({
      next: () => {
        console.log('Tokens destroyed on backend.');
        this.AuthRoleServiceService.clearUserSession(); // <-- Limpia sesión usando AuthService
        this.isFetching = false;
        if (!silent) {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.AuthRoleServiceService.clearUserSession(); // <-- Limpia sesión incluso si falla la API
        this.isFetching = false;
        if (!silent) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  /**
   * Redirects the user after successful login.
   */
  receiveLogin(): void {
    this.isFetching = false;
    this.errorMessage = '';
    // Podrías redirigir a un dashboard genérico o a una ruta específica basada en el rol si prefieres aquí,
    // pero el AuthGuard ya se encargaría de la redirección final si la ruta /app/analytics está protegida.
    this.router.navigate(['/app/dashboard']); // Redirige al dashboard principal
  }

  loginError(payload: string): void {
    this.isFetching = false;
    this.errorMessage = payload;
  }

  requestLogin(): void {
    this.isFetching = true;
  }

  areCredentialsValid(creds: any): boolean {
    const requiredFields = ['user', 'password'];
    return requiredFields.every(field => creds[field] && creds[field].length > 0);
  }
}