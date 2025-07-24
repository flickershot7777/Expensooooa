import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap dropdown after view init
    this.initializeDropdown();
  }

  private initializeDropdown(): void {
    // Wait for DOM to be ready and Bootstrap to be loaded
    setTimeout(() => {
      if (typeof bootstrap !== 'undefined' && this.dropdownToggle) {
        // Initialize Bootstrap dropdown manually
        new bootstrap.Dropdown(this.dropdownToggle.nativeElement);
      }
    }, 100);
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const dropdownElement = event.target as HTMLElement;
    const dropdownMenu = dropdownElement.closest('.dropdown')?.querySelector('.dropdown-menu') as HTMLElement;

    if (dropdownMenu) {
      const isOpen = dropdownMenu.classList.contains('show');

      // Close all other dropdowns first
      this.closeDropdown();

      // Toggle current dropdown
      if (!isOpen) {
        dropdownMenu.classList.add('show');
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Close dropdown if clicking outside
    if (!target.closest('.dropdown')) {
      this.closeDropdown();
    }

    // Close mobile menu if clicking outside navbar
    if (!target.closest('.navbar') && !target.closest('#navbarNav')) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(event: TouchEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
    });
  }

  toggleMobileMenu(): void {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
      // Use Bootstrap's Collapse API
      if (typeof bootstrap !== 'undefined') {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: true
        });
      } else {
        // Fallback toggle
        navbarCollapse.classList.toggle('show');
      }
    }
  }

  closeMobileMenu(): void {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      if (typeof bootstrap !== 'undefined') {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      } else {
        // Fallback
        navbarCollapse.classList.remove('show');
      }
    }
  }

  openProfile(): void {
    this.closeDropdown();
    // TODO: Navigate to profile page
    console.log('Profile clicked - implement profile page navigation');
  }

  openSettings(): void {
    this.closeDropdown();
    // TODO: Navigate to settings page
    console.log('Settings clicked - implement settings page navigation');
  }

  openAnalytics(): void {
    this.closeDropdown();
    // TODO: Navigate to analytics page
    console.log('Analytics clicked - implement analytics page navigation');
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
  }
}
