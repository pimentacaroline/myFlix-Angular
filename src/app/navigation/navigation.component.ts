import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Component that provides navigation functionalities within the app.
 * 
 * @component
 */
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})

export class NavigationComponent {

  /**
   * Constructor for the NavigationComponent.
   * 
   * @param router Provides the capabilities to navigate to different parts of the application.
   */
  constructor(private router: Router) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {}

  /**
   * Navigate to the movies view.
   */
  toMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Navigate to the user profile view.
   */
  toProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logout the user and navigate to the welcome view.
   */
  toLogout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
