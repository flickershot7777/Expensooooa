import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private expenseService: any = null;

  constructor(private router: Router) {
    // Check if user is already logged in
    this.checkLocalStorage();
  }

  // Method to set expense service reference (called from app component)
  setExpenseService(service: any): void {
    this.expenseService = service;
    // If user is already logged in, load their data
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.loadUserData(currentUser.id);
    }
  }

  private checkLocalStorage(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.currentUserSubject.next(userData);
      this.isAuthenticatedSubject.next(true);
    }
  }

  private loadUserData(userId: string): void {
    if (this.expenseService) {
      this.expenseService.loadUserExpenses(userId);
    }
  }

  login(email: string, password: string, isRegistration: boolean = false): Observable<{ success: boolean; message?: string }> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        if (email && password && password.length >= 6) {
          const existingUser = this.findUserByEmail(email);

          if (isRegistration) {
            // Registration mode - check if user already exists
            if (existingUser) {
              observer.next({
                success: false,
                message: 'An account with this email already exists. Please try logging in instead.'
              });
              observer.complete();
              return;
            }

            // Create new user
            const userId = this.generateUserIdFromEmail(email);
            const user: User = {
              id: userId,
              email: email,
              name: email.split('@')[0]
            };

            // Store user info and register
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.registerUser(user);

            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);

            // Load user's expenses after successful registration
            setTimeout(() => this.loadUserData(userId), 50);

            observer.next({ success: true, message: 'Account created successfully!' });
            observer.complete();

          } else {
            // Login mode - check if user exists
            if (!existingUser) {
              observer.next({
                success: false,
                message: 'No account found with this email. Please register first.'
              });
              observer.complete();
              return;
            }

            // User exists, proceed with login
            localStorage.setItem('currentUser', JSON.stringify(existingUser));
            this.currentUserSubject.next(existingUser);
            this.isAuthenticatedSubject.next(true);

            // Load user's expenses after successful login
            setTimeout(() => this.loadUserData(existingUser.id), 50);

            observer.next({ success: true, message: 'Login successful!' });
            observer.complete();
          }
        } else {
          observer.next({
            success: false,
            message: password.length < 6 ? 'Password must be at least 6 characters' : 'Please fill in all fields'
          });
          observer.complete();
        }
      }, 1000);
    });
  }

  // Separate method for registration
  register(email: string, password: string): Observable<{ success: boolean; message?: string }> {
    return this.login(email, password, true);
  }

  private generateUserIdFromEmail(email: string): string {
    // Create a consistent hash-like ID from email
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `user_${Math.abs(hash).toString(36)}`;
  }

  private registerUser(user: User): void {
    // Maintain a registry of all users for potential future use
    const users = this.getRegisteredUsers();
    const existingUserIndex = users.findIndex(u => u.email === user.email);

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }

  private getRegisteredUsers(): User[] {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  }

  // Method to find user by email (useful for login validation)
  findUserByEmail(email: string): User | null {
    const users = this.getRegisteredUsers();
    return users.find(u => u.email === email) || null;
  }

  logout(): void {
    // Clear user's expense data from memory
    if (this.expenseService) {
      this.expenseService.clearExpenses();
    }

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
