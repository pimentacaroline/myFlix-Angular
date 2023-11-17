import { Component, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';

/**
 * The MovieCardComponent is responsible for displaying information about a movie.
 * It serves as a card-style representation for a movie within the application.
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

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Fetches all movies from the API and updates the movies property
   */
  getMovies(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      if (this.isUserProfile) {
        let favorites: any = [];
        user.FavoriteMovies.forEach((fm: any) => {
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
   * Opens a dialog to display detailed information about a movie
   * @param title   The title of the movie to be displayed
   * @param description  The description of the movie to be displayed
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
   * Opens a dialog to display detailed information about a genre
   * @param genre   An object containing information about the genre, including Name and Description
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
   * Opens a dialog to display detailed information about a director
   * @param director  An object containing information about the director, including Name, Bio, and Birth
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
   * Toggles the favorite status of a movie for the currently logged-in user
   * If the movie is already a favorite, it will be removed from favorites
   * If it's not a favorite, it will be added to the favorites
   * @param movie  The movie object for which to toggle the favorite status
   * @returns {void}
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
      this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe(
        () => {
          console.log('Movie removed from favorites successfully.');
        },
        (error) => {
          console.error('Error removing movie from favorites:', error);
        }
      );
    } else {
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
   * Checks if a movie is in the list of favorite movies for the currently logged-in user
   * @param movie  The movie object to check for favorite status
   * @returns {boolean} - True if the movie is a favorite, false otherwise
   */
  isMovieFavorite(movie: any): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies && user.FavoriteMovies.includes(movie._id);
  }
}