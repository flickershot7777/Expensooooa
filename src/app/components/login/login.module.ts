import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { HomeComponent } from '../../home/home.component';
import { AddExpenseComponent } from '../add-expense/add-expense.component';
import path from 'path';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginRoutingModule
  ]
})
export class LoginModule {

  children=[
    { path: 'home', component: HomeComponent, title: 'Home Page' },
    {
      path: 'add-expense', component: AddExpenseComponent, title: 'Add Expense Page'
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
  ]
}
