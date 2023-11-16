import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

/**
 * Component that provides user profile functionalities.
 * 
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  user: any = {};
  FavoriteMovies: any[] = [];

  /**
   * Input data for the user profile.
   */
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
   * Fetch the user's data and their favorite movies.
   */
  getUser(): void {
    this.user = {};
    this.fetchApiData.getOneUser().subscribe((response: any) => {
      this.user = response;      
      this.userData.username = this.user.Username;
      this.userData.email = this.user.Email;
      if (this.user.Birthday) {
        this.userData.birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');
      }
    });
  }
  
  /**
   * Edit the user's profile data.
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
      // window.location.reload();
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

      this.fetchApiData.deleteUser().subscribe((result) => {
        if (result === 'delete')
        localStorage.clear();
      });

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