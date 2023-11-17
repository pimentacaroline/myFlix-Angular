import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * The UserRegistrationFormComponent is responsible for rendering and handling user registration.
 * It provides a form for users to enter their registration details and submit the registration request.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})

export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  /**
   * Initiates the user registration process by calling the userRegistration method from FetchApiDataService.
   * Handles the registration result, closing the modal on success and displaying appropriate messages.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        this.dialogRef.close(); //This will close the modal on success.
        this.snackBar.open('Successfully registered! Please login', 'OK', {
          duration: 4000
        });
      }, 
      error: (error) => {
        this.snackBar.open('Registration failed. Please try again.', 'OK', {
          duration: 4000
        });
      }
    });
  }
}
