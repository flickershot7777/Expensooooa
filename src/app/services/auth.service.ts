import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider?: 'email' | 'google';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    // Check if user is already logged in
    this.checkLocalStorage();
  }

  private checkLocalStorage(): void {
   try{

    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.isAuthenticatedSubject.next(true);
    }
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    localStorage.removeItem('currentUser');
  }
  }

  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        if (email && password) {
          const user: User = {
            id: this.generateUserId(email),
            email: email,
            name: email.split('@')[0],
            provider: 'email'
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      }, 1000);
    });
  }

  loginWithGoogle(googleUser: any): Observable<boolean> {
    return new Observable(observer => {
      const user: User = {
        id: this.generateUserId(googleUser.email),
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        provider: 'google'
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      observer.next(true);
      observer.complete();
    });
  }

  private generateUserId(email: string): string {
    // Generate a consistent user ID based on email
    return btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
  }  logout(): void {
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
