import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this.expensesSubject.asObservable();

  constructor() {
    // Don't load expenses on initialization since we need user context
    // Expenses will be loaded when user logs in via loadUserExpenses()
  }

  // Load expenses for a specific user
  loadUserExpenses(userId: string): void {
    const userExpensesKey = `expenses_${userId}`;
    const expenses = localStorage.getItem(userExpensesKey);

    if (expenses) {
      const parsedExpenses = JSON.parse(expenses).map((expense: any) => ({
        ...expense,
        date: new Date(expense.date)
      }));
      this.expensesSubject.next(parsedExpenses);
    } else {
      // Initialize empty array for new users
      this.expensesSubject.next([]);
    }
  }

  // Save expenses for a specific user
  private saveUserExpenses(userId: string, expenses: Expense[]): void {
    const userExpensesKey = `expenses_${userId}`;
    localStorage.setItem(userExpensesKey, JSON.stringify(expenses));
    this.expensesSubject.next(expenses);
  }

  // Clear current expenses (useful for logout)
  clearExpenses(): void {
    this.expensesSubject.next([]);
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    return new Observable(observer => {
      const newExpense: Expense = {
        ...expense,
        id: this.generateId()
      };

      const currentExpenses = this.expensesSubject.value;
      const updatedExpenses = [...currentExpenses, newExpense];
      this.saveUserExpenses(expense.userId, updatedExpenses);

      observer.next(newExpense);
      observer.complete();
    });
  }

  deleteExpense(id: string, userId: string): Observable<boolean> {
    return new Observable(observer => {
      const currentExpenses = this.expensesSubject.value;
      const updatedExpenses = currentExpenses.filter(expense => expense.id !== id);
      this.saveUserExpenses(userId, updatedExpenses);

      observer.next(true);
      observer.complete();
    });
  }

  getExpensesByUser(userId: string): Observable<Expense[]> {
    return new Observable(observer => {
      // Since we now load user-specific expenses, all expenses in the subject belong to the current user
      const allExpenses = this.expensesSubject.value;
      observer.next(allExpenses);
      observer.complete();
    });
  }

  getTotalExpenses(userId: string): Observable<number> {
    return new Observable(observer => {
      // Since we now load user-specific expenses, calculate total from all current expenses
      const total = this.expensesSubject.value.reduce((sum, expense) => sum + expense.amount, 0);
      observer.next(total);
      observer.complete();
    });
  }

  getExpensesByCategory(userId: string): Observable<{[key: string]: number}> {
    return new Observable(observer => {
      // Since we now load user-specific expenses, use all current expenses
      const categoryTotals = this.expensesSubject.value.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as {[key: string]: number});
      observer.next(categoryTotals);
      observer.complete();
    });
  }  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
