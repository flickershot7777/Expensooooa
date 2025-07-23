import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent {
  expenseForm: FormGroup;
  isLoading = false;
  successMessage = '';

  categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Business',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private expenseService: ExpenseService,
    private router: Router
  ) {
    this.expenseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.isLoading = true;
      const currentUser = this.authService.getCurrentUser();

      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      const expenseData = {
        ...this.expenseForm.value,
        amount: parseFloat(this.expenseForm.value.amount),
        date: new Date(this.expenseForm.value.date),
        userId: currentUser.id
      };

      this.expenseService.addExpense(expenseData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Expense added successfully!';
          this.expenseForm.reset();
          this.expenseForm.patchValue({
            date: new Date().toISOString().split('T')[0]
          });

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  get title() { return this.expenseForm.get('title'); }
  get amount() { return this.expenseForm.get('amount'); }
  get category() { return this.expenseForm.get('category'); }
  get date() { return this.expenseForm.get('date'); }
}
