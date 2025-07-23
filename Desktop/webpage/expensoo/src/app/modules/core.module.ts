import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Feature module for core/dashboard functionality
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ])
  ],
  providers: [
    // Core/dashboard-specific providers can be added here
  ]
})
export class CoreModule { }
