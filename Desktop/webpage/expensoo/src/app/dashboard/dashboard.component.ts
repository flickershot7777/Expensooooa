import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { ExpenseService } from '../services/expense.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalExpenses = 0;
  expensesByCategory: {[key: string]: number} = {};
  recentExpensesCount = 0;

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      // Load user-specific expenses first
      this.expenseService.loadUserExpenses(this.currentUser.id);
      // Then load dashboard data
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    if (!this.currentUser) return;

    this.expenseService.getTotalExpenses(this.currentUser.id).subscribe(total => {
      this.totalExpenses = total;
    });

    this.expenseService.getExpensesByCategory(this.currentUser.id).subscribe(categories => {
      this.expensesByCategory = categories;
    });

    this.expenseService.getExpensesByUser(this.currentUser.id).subscribe(expenses => {
      this.recentExpensesCount = expenses.length;
    });
  }

  get categoryNames(): string[] {
    return Object.keys(this.expensesByCategory);
  }

  logout(): void {
    this.authService.logout();
  }
}
