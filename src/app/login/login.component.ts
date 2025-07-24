import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  ngAfterViewInit(): void {
    // Initialize Google Sign-In after view is initialized
    setTimeout(() => {
      this.googleAuthService.initGoogleSignIn((response: any) => {
        this.handleGoogleCallback(response);
      });
    }, 100);
  }

  handleGoogleCallback(response: any): void {
    if (response.credential) {
      const decodedToken = this.googleAuthService.decodeJwt(response.credential);

      const googleUser = {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      };

      this.authService.loginWithGoogle(googleUser).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Google authentication failed';
          }
        },
        error: (error: any) => {
          this.errorMessage = 'Google authentication failed. Please try again.';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (success: boolean) => {
          this.isLoading = false;
          if (success) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Invalid credentials';
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Login failed. Please try again.';
        }
      });
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
