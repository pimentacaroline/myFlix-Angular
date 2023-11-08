import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';


// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


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

  ngOnInit(): void {
  }
/**
 * This method will send the form inputs to the backend
 * @param void
 * @returns user object
 * @memberof UserLoginFormComponent
 * @see FetchApiDataService.userLogin()
 * @example loginUser()
 */
  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.loginData).subscribe({
      next: (data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('Username', data.user.Username);

        this.dialogRef.close();
        this.snackBar.open('You have logged in', 'OK', {
          duration: 2000
        });
        this.router.navigate(['movies']);
      },
      error: () => {
        this.snackBar.open('Ups! something went wrong. Please try again', 'OK', {
          duration: 2000
        });
      }
    });
  }
}