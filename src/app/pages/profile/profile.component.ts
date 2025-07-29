import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthRoleServiceService } from '../../services/auth-role-service.service'; // Asegúrate de que la ruta sea correcta
import { ToastrService } from 'ngx-toastr'; // Para notificaciones al usuario

@Component({
  selector: '[profile]',
  templateUrl: './profile.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./profile.style.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: any | null = null;
  profileSubscription: Subscription | undefined;

  passwordForm: FormGroup;
  imageFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null; // Para mostrar la vista previa de la imagen

  constructor(
    private AuthRoleServiceService: AuthRoleServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // Inicialización del formulario de cambio de contraseña
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator }); // Validador para que las contraseñas coincidan
  }

  ngOnInit(): void {
    // Suscribirse a los datos del usuario actual desde AuthService
    this.profileSubscription = this.AuthRoleServiceService.currentUserData$.subscribe(userData => {
      this.currentUser = userData;
      // Puedes establecer una imagen de perfil por defecto si no hay una
      if (this.currentUser && !this.currentUser.profilePictureUrl) {
        this.imagePreviewUrl = 'https://placehold.co/150x150/aabbcc/ffffff?text=User'; // Imagen por defecto
      } else if (this.currentUser && this.currentUser.profilePictureUrl) {
        this.imagePreviewUrl = this.currentUser.profilePictureUrl;
      }
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  // Validador personalizado para que la nueva contraseña y su confirmación coincidan
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value
      ? null : { mismatch: true };
  }

  // Manejo de la selección de archivo de imagen
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      // Mostrar vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.imageFile);
    } else {
      this.imageFile = null;
      // Si no hay imagen seleccionada, vuelve a la imagen por defecto o la actual del usuario
      this.imagePreviewUrl = this.currentUser?.profilePictureUrl || 'https://placehold.co/150x150/aabbcc/ffffff?text=User';
    }
  }

  // Lógica para subir la imagen de perfil
  uploadProfileImage(): void {
    if (!this.imageFile) {
      this.toastr.warning('Por favor, selecciona una imagen para subir.');
      return;
    }

    // Aquí iría la lógica para enviar la imagen al backend.
    // Esto generalmente implica un FormData y una llamada HttpClient.
    // Por ahora, simularemos una subida exitosa.
    this.toastr.info('Subiendo imagen...');

    // Simulación de llamada a API
    setTimeout(() => {
      // Suponiendo que el backend devuelve la URL de la nueva imagen
      const newImageUrl = 'https://placehold.co/150x150/28a745/ffffff?text=Uploaded'; // URL simulada
      this.currentUser.profilePictureUrl = newImageUrl; // Actualiza la URL en el usuario actual
      this.AuthRoleServiceService.setUserSession(this.currentUser); // Actualiza la sesión en AuthService
      this.toastr.success('Imagen de perfil actualizada con éxito.');
      this.imageFile = null; // Limpiar el archivo seleccionado
    }, 1500);

    // Ejemplo de cómo harías la llamada real a un servicio de backend:
    /*
    const formData = new FormData();
    formData.append('profileImage', this.imageFile);

    this.profileService.uploadImage(formData).subscribe({
      next: (response) => {
        // Asumiendo que la respuesta contiene la nueva URL de la imagen
        this.currentUser.profilePictureUrl = response.imageUrl;
        this.AuthRoleServiceService.setUserSession(this.currentUser); // Actualiza la sesión en AuthRoleServiceService
        this.toastr.success('Imagen de perfil actualizada con éxito.');
        this.imageFile = null;
      },
      error: (err) => {
        console.error('Error al subir la imagen:', err);
        this.toastr.error('Error al subir la imagen. Inténtalo de nuevo.');
      }
    });
    */
  }

  // Lógica para cambiar la contraseña
  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.toastr.error('Por favor, completa el formulario correctamente.');
      // Opcional: Marcar todos los campos como tocados para mostrar errores de validación
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    // Aquí iría la lógica para enviar la solicitud de cambio de contraseña al backend.
    // Por ahora, simularemos una llamada exitosa.
    this.toastr.info('Cambiando contraseña...');

    // Simulación de llamada a API
    setTimeout(() => {
      // En un caso real, el backend validaría la currentPassword
      if (currentPassword === 'password123') { // Simulación de validación de contraseña actual
        this.toastr.success('Contraseña cambiada con éxito.');
        this.passwordForm.reset(); // Limpiar el formulario
      } else {
        this.toastr.error('Contraseña actual incorrecta.');
      }
    }, 1500);

    // Ejemplo de cómo harías la llamada real a un servicio de backend:
    /*
    this.profileService.changePassword(currentPassword, newPassword).subscribe({
      next: (response) => {
        this.toastr.success('Contraseña cambiada con éxito.');
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('Error al cambiar la contraseña:', err);
        this.toastr.error('Error al cambiar la contraseña. Verifica tu contraseña actual.');
      }
    });
    */
  }
}
