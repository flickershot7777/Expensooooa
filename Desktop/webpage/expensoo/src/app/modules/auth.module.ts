import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// This is a feature module for authentication-related functionality
// Since we're using standalone components, this module serves as a container
// for authentication routes and providers

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('../login/login.component').then(m => m.LoginComponent)
      }
    ])
  ],
  providers: [
    // Authentication-specific providers can be added here
  ]
})
export class AuthModule { }
