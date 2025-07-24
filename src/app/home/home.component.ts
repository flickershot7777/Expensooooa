
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  navigateToAddExpense(): void {
    this.router.navigate(['/add-expense']);
  }

  navigateToViewExpenses(): void {
    this.router.navigate(['/view-expense']);
  }
}
