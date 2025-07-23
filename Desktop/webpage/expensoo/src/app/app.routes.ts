import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    title: 'Login - Expensoo'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth.module').then(m => m.AuthModule),
    title: 'Authentication - Expensoo'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    title: 'Dashboard - Expensoo'
  },
  {
    path: 'expenses',
    loadChildren: () => import('./modules/expense.module').then(m => m.ExpenseModule),
    canActivate: [AuthGuard],
    title: 'Expenses - Expensoo'
  },
  {
    path: 'add-expense',
    loadComponent: () => import('./componets/add-expense/add-expense.component').then(m => m.AddExpenseComponent),
    canActivate: [AuthGuard],
    title: 'Add Expense - Expensoo'
  },
  {
    path: 'view-expense',
    loadComponent: () => import('./componets/view-expense/view-expense.component').then(m => m.ViewExpenseComponent),
    canActivate: [AuthGuard],
    title: 'View Expenses - Expensoo'
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
