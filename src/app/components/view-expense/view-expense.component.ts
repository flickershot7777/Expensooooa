import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-expense',
  standalone: true,
  imports: [DatePipe, CommonModule, RouterModule],
  templateUrl: './view-expense.component.html',
  styleUrl: './view-expense.component.css'
})
export class ViewExpenseComponent implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  totalAmount: number = 0;
  private expensesSubscription: Subscription = new Subscription();

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expensesSubscription = this.expenseService.getExpenses().subscribe((expenses: Expense[]) => {
      this.expenses = expenses;
      this.calculateTotal();
    });
  }

  ngOnDestroy() {
    if (this.expensesSubscription) {
      this.expensesSubscription.unsubscribe();
    }
  }

  deleteExpense(id: string) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: (success) => {
          if (success) {
            console.log('Expense deleted successfully');
          } else {
            alert('Failed to delete expense');
          }
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
          alert('Error deleting expense');
        }
      });
    }
  }

  private calculateTotal() {
    this.totalAmount = this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }
}
