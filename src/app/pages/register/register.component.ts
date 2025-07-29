import { Component, HostBinding } from "@angular/core";
import { RegisterService } from "./register.service";
import { LoginService } from "../login/login.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./register.template.html",
})
export class RegisterComponent {
  @HostBinding("class") classes = "auth-page app";

  registerForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email, Validators.minLength(1)]),
    name: new FormControl("", [Validators.required, Validators.minLength(1)]),
    lastname: new FormControl("", [Validators.required, Validators.minLength(1)]),
    username: new FormControl("", [Validators.required, Validators.minLength(1)]),
    role: new FormControl("", [Validators.required, Validators.minLength(1)]),
    password: new FormControl("", [Validators.required, Validators.minLength(1)]),
    confirmPassword: new FormControl("", [Validators.required, Validators.minLength(1)])
  });

  constructor(
    public loginService: LoginService,
    public registerService: RegisterService
  ) {}

  valueForms(input_parameter: string) {
    return this.registerForm.get(input_parameter)?.value;
  }

  requiredAllowZero(control: FormControl) {
    const value = control.value;
    return value === 0 || !!value ? null : { required: true };
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerService.registerError("Password field is empty");
      return;
    }

    const password: string = this.valueForms("password");
    const confirmPassword: string = this.valueForms("confirmPassword");

    if (!this.checkPassword(password, confirmPassword)) {
      return;
    }

    this.registerService.registerUser(this.registerForm.value);
  }

  checkPassword(password: string, confirmPassword: string): boolean {
    let error = "";
    if (!password) {
      error = "Password field is empty";
    } else if (password !== confirmPassword) {
      error = "Passwords are not equal";
    }
    if (error) {
      this.registerService.registerError(error);
      setTimeout(() => {
        this.registerService.registerError("");
      }, 3000);
      return false;
    }
    return true;
  }

}
