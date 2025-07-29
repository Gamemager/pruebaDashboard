import {AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { environment } from "../../../environments/environment";

@Injectable()
export class RegisterService {
  config: any;
  _isFetching: boolean = false;
  _errorMessage: string = "";

  constructor(
    appConfig: AppConfig,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.config = appConfig.getConfig();
  }

  get isFetching() {
    return this._isFetching;
  }

  set isFetching(val: boolean) {
    this._isFetching = val;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(val: string) {
    this._errorMessage = val;
  }

  registerUser(data) {
    if (!this.config.isBackend) {
      this.toastr.success("You've been registered successfully");
      this.router.navigate(["/login"]);
    } else {
      this.requestRegister();
      this.http.post(`/admin/register`, data)
        .subscribe({
          next: (response) => {
            this.receiveRegister();
            this.toastr.success("You've been registered successfully");
            this.router.navigate(["/login"]);
          },
          error: (error) => {
            this.registerError(
              Array.isArray(error.error.message)
                ? error.error.message.join("\n")
                : error.error.message || "An error occurred during registration"
            );
            this.toastr.error(
              Array.isArray(error.error.message)
                ? error.error.message.join("\n")
                : error.error.message
            );
          }
        });
    }
  }

  requestRegister() {
    this.isFetching = true;
  }

  receiveRegister() {
    this.isFetching = false;
    this.errorMessage = "";
  }

  registerError(payload) {
    this.isFetching = false;
    this.errorMessage = payload;
  }
}
