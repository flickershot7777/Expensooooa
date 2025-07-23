import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Feature module for expense management functionality
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'add',
        loadComponent: () => import('../componets/add-expense/add-expense.component').then(m => m.AddExpenseComponent)
      },
      {
        path: 'view',
        loadComponent: () => import('../componets/view-expense/view-expense.component').then(m => m.ViewExpenseComponent)
      },
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full'
      }
    ])
  ],
  providers: [
    // Expense-specific providers can be added here
  ]
})
export class ExpenseModule { }
