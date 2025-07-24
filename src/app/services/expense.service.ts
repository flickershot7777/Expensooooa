import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  productType: string;
  date: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenses: Expense[] = [];
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this.expensesSubject.asObservable();

  constructor(private authService: AuthService) {
    // Load expenses when user changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadUserExpenses(user.id);
      } else {
        this.expenses = [];
        this.expensesSubject.next([]);
      }
    });
  }

  private loadUserExpenses(userId: string): void {
    const allExpenses = JSON.parse(localStorage.getItem('allExpenses') || '[]');
    this.expenses = allExpenses.filter((expense: Expense) => expense.userId === userId);
    this.expensesSubject.next(this.expenses);
  }

  private saveAllExpenses(): void {
    const allExpenses = JSON.parse(localStorage.getItem('allExpenses') || '[]');
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) return;

    // Remove old expenses for this user
    const otherUsersExpenses = allExpenses.filter((expense: Expense) => expense.userId !== currentUser.id);

    // Add current user's expenses
    const updatedExpenses = [...otherUsersExpenses, ...this.expenses];

    localStorage.setItem('allExpenses', JSON.stringify(updatedExpenses));
  }

  addExpense(expense: Omit<Expense, 'id' | 'userId'>): Observable<string> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.error('User not authenticated');
        return;
      }

      const newExpense: Expense = {
        ...expense,
        id: this.generateId(),
        userId: currentUser.id
      };

      this.expenses.push(newExpense);
      this.expensesSubject.next(this.expenses);

      // Save to localStorage
      this.saveAllExpenses();

      observer.next(newExpense.id);
      observer.complete();
    });
  }

  getExpenses(): Observable<Expense[]> {
    return this.expenses$;
  }

  deleteExpense(id: string): Observable<boolean> {
    return new Observable(observer => {
      const index = this.expenses.findIndex(expense => expense.id === id);

      if (index !== -1) {
        this.expenses.splice(index, 1);
        this.expensesSubject.next(this.expenses);

        // Update localStorage
        this.saveAllExpenses();

        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  updateExpense(id: string, updatedExpense: Partial<Expense>): Observable<boolean> {
    return new Observable(observer => {
      const index = this.expenses.findIndex(expense => expense.id === id);

      if (index !== -1) {
        this.expenses[index] = { ...this.expenses[index], ...updatedExpense };
        this.expensesSubject.next(this.expenses);

        // Update localStorage
        this.saveAllExpenses();

        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  getTotalAmount(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
