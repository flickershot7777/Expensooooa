import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ExpenseService, Expense } from '../../services/expense.service';

@Component({
  selector: 'app-view-expense',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './view-expense.component.html',
  styleUrl: './view-expense.component.css'
})
export class ViewExpenseComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  isLoading = true;
  selectedCategory = '';
  sortBy = 'date';
  sortOrder = 'desc';
  totalAmount = 0;

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
    private authService: AuthService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Load user-specific expenses first
      this.expenseService.loadUserExpenses(currentUser.id);
    }
    this.loadExpenses();
  }

  loadExpenses(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.expenseService.getExpensesByUser(currentUser.id).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.filteredExpenses = [...expenses];
        this.calculateTotal();
        this.applySorting();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onCategoryFilter(): void {
    if (this.selectedCategory === '') {
      this.filteredExpenses = [...this.expenses];
    } else {
      this.filteredExpenses = this.expenses.filter(expense =>
        expense.category === this.selectedCategory
      );
    }
    this.calculateTotal();
    this.applySorting();
  }

  onSort(): void {
    this.applySorting();
  }

  applySorting(): void {
    this.filteredExpenses.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  deleteExpense(expense: Expense): void {
    if (confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.expenseService.deleteExpense(expense.id, currentUser.id).subscribe({
          next: () => {
            this.loadExpenses();
          }
        });
      }
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
