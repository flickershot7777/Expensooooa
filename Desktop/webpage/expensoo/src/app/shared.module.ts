// Barrel exports for all components and services
// This file serves as a central export point for all modules

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ExpenseService } from './services/expense.service';
import { AuthGuard } from './guards/auth.guard';

// Component exports
export { LoginComponent } from './login/login.component';
export { DashboardComponent } from './dashboard/dashboard.component';
export { AddExpenseComponent } from './componets/add-expense/add-expense.component';
export { ViewExpenseComponent } from './componets/view-expense/view-expense.component';

// Service exports
export { AuthService } from './services/auth.service';
export type { User } from './services/auth.service';
export { ExpenseService } from './services/expense.service';
export type { Expense } from './services/expense.service';

// Guard exports
export { AuthGuard } from './guards/auth.guard';

// Common module re-exports
export { CommonModule } from '@angular/common';
export { ReactiveFormsModule, FormsModule } from '@angular/forms';
export { RouterModule } from '@angular/router';

// Utility function to get all common imports for standalone components
export function getCommonImports() {
  return [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ];
}

// Utility function to get all services
export function getSharedServices() {
  return [
    AuthService,
    ExpenseService,
    AuthGuard
  ];
}
