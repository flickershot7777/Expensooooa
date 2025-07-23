// Main barrel export file for the entire application
// This serves as the universal module system for all components, services, and utilities

// Re-export everything from shared module
export * from './shared.module';

// Re-export all feature modules
export * from './modules';

// Re-export universal components
export * from './components/universal.components';

// Re-export specific feature components with aliases for clarity
export { LoginComponent as ExpensooLoginComponent } from './login/login.component';
export { DashboardComponent as ExpenseoDashboardComponent } from './dashboard/dashboard.component';
export { AddExpenseComponent as ExpensooAddExpenseComponent } from './componets/add-expense/add-expense.component';
export { ViewExpenseComponent as ExpensooViewExpenseComponent } from './componets/view-expense/view-expense.component';

// Constants for easy access to component arrays
export const EXPENSOO_CORE_COMPONENTS = [
  'LoginComponent',
  'DashboardComponent',
  'AddExpenseComponent',
  'ViewExpenseComponent'
] as const;

export const EXPENSOO_FEATURE_MODULES = [
  'AuthModule',
  'ExpenseModule',
  'CoreModule'
] as const;

// Application configuration constants
export const APP_CONFIG = {
  name: 'Expensoo',
  version: '1.0.0',
  description: 'Personal Expense Tracking Application',
  features: {
    authentication: true,
    expenseTracking: true,
    dashboard: true,
    lazyLoading: true,
    responsiveDesign: true
  },
  routes: {
    login: '/login',
    dashboard: '/dashboard',
    addExpense: '/add-expense',
    viewExpenses: '/view-expense',
    expensesModule: '/expenses'
  }
} as const;

// Utility functions for module management
export class ExpensooModuleUtils {
  static getAvailableComponents(): string[] {
    return Array.from(EXPENSOO_CORE_COMPONENTS);
  }

  static getAvailableModules(): string[] {
    return Array.from(EXPENSOO_FEATURE_MODULES);
  }

  static getAppInfo() {
    return APP_CONFIG;
  }

  static isFeatureEnabled(feature: keyof typeof APP_CONFIG.features): boolean {
    return APP_CONFIG.features[feature];
  }
}
