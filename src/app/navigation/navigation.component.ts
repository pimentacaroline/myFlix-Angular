import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The NavigationComponent is responsible for rendering the navigation bar of the application.
 * It provides links and navigation options for users to navigate through different sections of the application.
 */
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})


export class NavigationComponent {

  constructor(private router: Router) { }

  ngOnInit(): void { }
  
  /**
   * Checks if a user is currently logged in by verifying the presence of an authentication token.
   * @returns {boolean} - True if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  toMovies(): void {
    this.router.navigate(['movies']);
  }

  toProfile(): void {
    this.router.navigate(['profile']);
  }

  toLogout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
