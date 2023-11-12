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

  constructor(private router: Router) { }

  // Implement this method in your authentication service
  isLoggedIn(): boolean {
    // Replace the following line with your actual authentication check
    return localStorage.getItem('token') !== null;
  }

  ngOnInit(): void { }

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
