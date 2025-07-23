import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ExpenseService } from './services/expense.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'expensoo';

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    // Set up cross-service communication
    this.authService.setExpenseService(this.expenseService);
  }
}
