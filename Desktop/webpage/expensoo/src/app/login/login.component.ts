import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isRegistrationMode = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { email, password } = this.loginForm.value;

      const authCall = this.isRegistrationMode
        ? this.authService.register(email, password)
        : this.authService.login(email, password);

      authCall.subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result.success) {
            if (this.isRegistrationMode) {
              this.successMessage = result.message || 'Account created successfully!';
              // Auto-switch to login mode after successful registration
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 1500);
            } else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            this.errorMessage = result.message || 'Authentication failed';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred. Please try again.';
        }
      });
    }
  }

  toggleMode(): void {
    this.isRegistrationMode = !this.isRegistrationMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginForm.reset();
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
