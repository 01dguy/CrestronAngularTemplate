//Service for storing the current theme of the application

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: string = 'theme-light'; // Default theme

  constructor() {
    // Load the theme from local storage if available
    const storedTheme = localStorage.getItem('currentTheme');
    if (storedTheme) {
      this.currentTheme = storedTheme;
    }
  }

  // Get the current theme
  getTheme(): string {
    return this.currentTheme;
  }

  // Set the current theme
  setTheme(theme: string): void {
    this.currentTheme = theme;
    localStorage.setItem('currentTheme', theme);
  }

}
