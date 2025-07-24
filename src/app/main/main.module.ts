import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AddExpenseComponent } from '../components/add-expense/add-expense.component';
import { ViewExpenseComponent } from '../components/view-expense/view-expense.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'home', component: HomeComponent },
      { path: 'add-expense', component: AddExpenseComponent },
      { path: 'view-expense', component: ViewExpenseComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ])
  ]
})
export class MainModule { }
