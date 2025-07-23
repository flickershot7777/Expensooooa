// Universal Components Library for Expensoo App
// This file provides reusable components and utilities across the application

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Loading Spinner Component
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [ngClass]="{'inline': inline}">
      <div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>
      <p *ngIf="message" class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .loading-container.inline {
      padding: 0.5rem;
      flex-direction: row;
      gap: 0.5rem;
    }
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .loading-message {
      margin: 0.5rem 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = '';
  @Input() size: number = 40;
  @Input() inline: boolean = false;
}

// Empty State Component
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon }}</div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button *ngIf="actionText && actionRoute"
              class="btn btn-primary"
              [routerLink]="actionRoute">
        {{ actionText }}
      </button>
      <button *ngIf="actionText && !actionRoute"
              class="btn btn-primary"
              (click)="actionClick.emit()">
        {{ actionText }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.6;
    }
    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.5rem;
    }
    .empty-state p {
      margin: 0 0 1.5rem 0;
      color: #666;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = '📋';
  @Input() title: string = 'No items found';
  @Input() message: string = 'There are no items to display.';
  @Input() actionText: string = '';
  @Input() actionRoute: string = '';
  @Output() actionClick = new EventEmitter<void>();
}

// Confirmation Modal Component
@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" (click)="onCancel()">
            {{ cancelText }}
          </button>
          <button class="btn btn-danger" (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      border-radius: 10px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .modal-content h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }
    .modal-content p {
      margin: 0 0 1.5rem 0;
      color: #666;
      line-height: 1.5;
    }
    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    .btn-secondary:hover {
      background: #5a6268;
    }
    .btn-danger {
      background: #dc3545;
      color: white;
    }
    .btn-danger:hover {
      background: #c82333;
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onOverlayClick(event: Event): void {
    this.onCancel();
  }
}

// Page Header Component
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header">
      <button *ngIf="showBackButton"
              class="back-btn"
              [routerLink]="backRoute">
        ← {{ backText }}
      </button>
      <div class="header-content">
        <div class="header-text">
          <h1>{{ title }}</h1>
          <p *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      max-width: 1200px;
      margin: 0 auto 2rem auto;
    }
    .back-btn {
      background: transparent;
      border: none;
      color: #667eea;
      font-size: 1rem;
      cursor: pointer;
      margin-bottom: 1rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .back-btn:hover {
      color: #5a6fd8;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .header-text h1 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 2rem;
      font-weight: 600;
    }
    .header-text p {
      margin: 0;
      color: #666;
    }
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: start;
      }
      .header-text h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showBackButton: boolean = false;
  @Input() backRoute: string = '/dashboard';
  @Input() backText: string = 'Back to Dashboard';
}

// Export all universal components
export const UNIVERSAL_COMPONENTS = [
  LoadingSpinnerComponent,
  EmptyStateComponent,
  ConfirmationModalComponent,
  PageHeaderComponent
] as const;
