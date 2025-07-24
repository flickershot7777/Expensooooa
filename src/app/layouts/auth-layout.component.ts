import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout min-vh-100 d-flex align-items-center justify-content-center">
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `]
})
export class AuthLayoutComponent {}
