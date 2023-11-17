import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

/**
 * The UserProfileComponent is responsible for displaying and managing user profile information.
 * It provides functionality such as viewing and editing user details, managing favorite movies, etc.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  user: any = {};
  FavoriteMovies: any[] = [];

  @Input() userData = { username: '', password: '', email: '', birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Fetches user data and updates the component's user and userData properties
   * This method is typically called during the initialization of the component
   */
  getUser(): void {
    // Reset user object to ensure a clean state
    this.user = {};

    // Fetch user data from the API
    this.fetchApiData.getOneUser().subscribe((response: any) => {
      // Update the user property with the retrieved data
      this.user = response;    
      
      // Update the userData property with relevant user details
      this.userData.username = this.user.Username;
      this.userData.email = this.user.Email;

      // Format and set the birthday if available
      if (this.user.Birthday) {
        this.userData.birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');
      }
    });
  }
  
  /**
   * Edits the user's information based on the provided userData
   * Sends an API request to update the user data and handles the response
   */
  editUser(): void {
    let payload = {
      Birthday: this.userData.birthday,
      Email: this.userData.email,
      Password: this.userData.password,
      Username: this.userData.username,
    };

    this.fetchApiData.editUser(payload).subscribe((data) => {
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('username', data.username);
      this.snackBar.open('User has been updated', 'OK', {
        duration: 2000
      })
      window.location.reload();
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      })
    });
  }

  /**
   * Initiates the process of deleting the user's account.
   * Displays a confirmation dialog, and if confirmed, sends an API request to delete the user.
   * Clears local storage upon successful deletion and navigates to the welcome page.
   */
  deleteUser(): void {
    // Display a confirmation dialog
    if (confirm('are you sure?')) {
      // Send an API request to delete the user's account
      this.fetchApiData.deleteUser().subscribe((result) => {
        if (result === 'delete')
        localStorage.clear();
      });

      // Navigate to the welcome page and show a success message
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account',
          'OK',
          {
            duration: 2000,
          }
        );
      });

    }
  }
}