import { Component, OnInit, Input } from '@angular/core';
//Use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
//This import brings in the API calls created in Task 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
//Import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

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

  //This function is responsible for sending the form inputs to the backend
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
