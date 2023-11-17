import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * The UserLoginFormComponent is responsible for rendering and handling user login.
 * It provides a form for users to enter their login credentials and submit the login request.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})

export class UserLoginFormComponent implements OnInit {

  @Input() loginData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  /**
   * Initiates the user login process by calling the userLogin method from FetchApiDataService.
   * Handles the login result, storing user data and token in localStorage on success,
   * closing the modal, showing appropriate messages, and navigating to the 'movies' route.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.loginData).subscribe({
      next: (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

        // Close the modal on successful login
        this.dialogRef.close(); 

        // Display a success message using MatSnackBar
        this.snackBar.open('Logged in', 'OK', {
          duration: 2000,
        });

        // Navigate to the 'movies' route after successful login
        this.router.navigate(['movies']);
      },
      error: (error) => {
        // Log the login error for debugging purposes
        console.error('Login Error:', error);

        // Display an error message using MatSnackBar on login failure
        this.snackBar.open('Login failed. Please check your credentials.', 'OK', {
          duration: 2000,
        });
      }
    });
  }

}