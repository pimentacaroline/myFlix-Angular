import { Component, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';

/**
 * A component that represents a movie card.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  @Input() isUserProfile: boolean = false;
  @Input() userFavourites: [] = [];

  movies: any[] = [];

  /**
   * @param fetchApiData - Service to fetch movie data.
   * @param snackbar - Service to show snack bar notifications.
   * @param dialog - Service to open dialogs.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Fetches all movies from the API and updates the movies property.
   */
  getMovies(): void {
    let uniqueUserFavourites = [...new Map(this.userFavourites.map((item) => [item["_id"], item])).values()];
    
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      if (this.isUserProfile) {
        let favorites: any = [];

        uniqueUserFavourites.forEach((fm: any) => {
          let favorite = resp.find((m: any) => m._id == fm);
          favorites.push(favorite)
        });

        this.movies = favorites;
      }
      else {
        this.movies = resp;
      }

      return this.movies;
    });
  }

  /**
   * Opens a dialog with movie details.
   * @param title 
   * @param description 
   */
  openMovieInfo(Title: string, Description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        Title: Title,
        Description: Description,
      },
    });
  }

  /**
   * Opens a dialog with genre details.
   * @param genre 
   */
  openGenreInfo(Genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: Genre.Name,
        Description: Genre.Description,
      },
    });
  }

  /**
   * Opens a dialog with director details.
   * @param director
   */
  openDirectorInfo(Director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: Director.Name,
        Bio: Director.Bio,
        Birth: Director.Birth,
      },
    });
  }

  /**
   * Toggles a movie's favorite status for the user.
   * @param movie - The movie to be added/removed from favorites.
   */
  toggleFavorite(movie: any): void {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user and favoriteMovies are defined
    if (!user || !user.FavoriteMovies) {
      console.error('User or favoriteMovies is undefined.');
      return;
    }

    // Toggle the favorite status of the movie
    if (this.isMovieFavorite(movie)) {
      // Remove the movie from favorites locally
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.FavoriteMovies = user.FavoriteMovies.filter(
        (id: string) => id !== movie._id
      );
      localStorage.setItem('user', JSON.stringify(user));

      // Remove the movie from favorites on the backend server
      this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe(
        () => {
          console.log('Movie removed from favorites successfully.');
        },
        (error) => {
          console.error('Error removing movie from favorites:', error);
        }
      );
    } else {
      // Add the movie to favorites locally
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.FavoriteMovies.push(movie._id);
      localStorage.setItem('user', JSON.stringify(user));

      // Add the movie to favorites on the backend server
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe(
        () => {
          console.log('Movie added to favorites successfully.');
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
        }
      );
    }

    // Update the local 'isFavorite' property to reflect the change
    movie.isFavorite = !this.isMovieFavorite(movie);
  }

  /**
 * Checks if a movie is in the user's favorites.
 * @param movie - The movie to check.
 * @returns A boolean indicating if the movie is in favorites.
 */
  isMovieFavorite(movie: any): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies && user.FavoriteMovies.includes(movie._id);
  }
}