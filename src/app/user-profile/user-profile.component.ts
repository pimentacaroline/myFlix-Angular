import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

/**
 * Component that provides user profile functionalities.
 * 
 * @component
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  user: any = {};
  favoriteMovies: any[] = [];

  /**
   * Input data for the user profile.
   */
  @Input() userData = { username: '', password: '', email: '', birthday: '' };

  
  /**
   * Constructor for the UserProfileComponent.
   * 
   * @param fetchApiData Service to handle the API calls.
   * @param snackBar For showing notifications to the user.
   * @param router For navigating to different routes.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Fetch the user's data and their favorite movies.
   */
  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((response: any) => {
      this.user = response;
      this.userData.username = this.user.Username;
      this.userData.email = this.user.Email;
      if (this.user.Birthday) {
        console.log('User Birthday:', this.user.birthday);
        this.userData.birthday = formatDate(this.user.birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');
      }
  
      this.fetchApiData.getAllMovies().subscribe((response: any) => {
        if (this.user.favoriteMovies && Array.isArray(this.user.favoriteMovies)) {
          this.favoriteMovies = response.filter((m: { _id: any }) => this.user.favoriteMovies.indexOf(m._id) >= 0);
        } else {
          this.favoriteMovies = [];
        }
      });
    }, (error) => {
      console.error('Error fetching user data', error);
    });
  }
  
  /**
   * Edit the user's profile data.
   */
  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((data) => {
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
   * Delete the user's account.
   */
  deleteUser(): void {
    if (confirm('are you sure?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account',
          'OK',
          {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        localStorage.clear();
      });
    }
  }
}