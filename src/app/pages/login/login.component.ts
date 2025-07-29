import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './login.service';
import { AppConfig } from '../../app.config';
import { Subscription } from 'rxjs';
import { AuthRoleServiceService, UserRole } from '../../services/auth-role-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.template.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'auth-page app';
  loginForm: FormGroup;
  private authSubscription: Subscription;

  constructor(
    public loginService: LoginService,
    private AuthRoleServiceService: AuthRoleServiceService, 
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfig
  ) {
    const config: any = appConfig.getConfig();
    this.loginForm = this.fb.group({
      user: [config.auth.user || '', Validators.required],
      password: [config.auth.password || '', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.authSubscription = this.AuthRoleServiceService.userRole$.subscribe(userRole => {
      if (userRole !== null) { // Si el rol ya no es null, significa que el usuario está logueado
        this.router.navigate(['/app/dashboard']); // Redirige al dashboard principal
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      const { user, password, rememberMe } = this.loginForm.value;
      this.loginService.loginUser({ user, password, rememberMe }).subscribe({
        next: (success) => {
          console.log('Login attempt completed. Success:', success);
        },
        error: (err) => {
          console.error('Login failed in component:', err);
        }
      });
    } else {
      this.loginService.errorMessage = 'Por favor, introduce tu usuario y contraseña.';
    }
  }
}
