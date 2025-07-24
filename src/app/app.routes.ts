
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';



export const routes: Routes = [


{path: 'login',
 loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)},
{
  path:'auth',
loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
},
{path:'home',
  
  loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  canActivate: [AuthGuard],
  title: 'Home'
  },
{path: 'view-expense',
  loadComponent: () => import('./components/view-expense/view-expense.component').then(m => m.ViewExpenseComponent),
  canActivate: [AuthGuard],
  title: 'View Expense'
},
{path: 'add-expense',
  loadComponent: () => import('./components/add-expense/add-expense.component').then(m => m.AddExpenseComponent),
  canActivate: [AuthGuard],
  title: 'Add Expense'
},


  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
