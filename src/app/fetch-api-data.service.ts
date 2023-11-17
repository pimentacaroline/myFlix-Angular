import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://cp-movies-api-41b2d280c95b.herokuapp.com/';

/**
 * This service provides functionality related to movies.
 * It handles operations such as retrieving, adding, and managing movie data.
 */
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
 
  /**
   * @constructor
   * @param http 
   */
  constructor(private http: HttpClient) { }

  /**
   * Register a new user
   * @param userDetails  User details to be registered
   * @returns  An Observable that emits the result of the user registration
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Log in a user
   * @param userDetails  User details for login
   * @returns  An Observable that emits the result of the user login
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get a list of all movies
   * @returns  An Observable that emits the list of all movies
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch one movie by its title
   * @param title  The movie title
   * @returns  An Observable that emits the movie data
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get information about a director by name
   * @param directorName  The name of the director
   * @returns  An Observable that emits the director's information
   */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get information about a genre by name
   * @param genreName  The name of the genre
   * @returns  An Observable that emits information about the genre
   */
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get information about the currently logged-in user
   * @returns  An Observable that emits the user information
   */
  getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return of (user);
  }

  /**
   * Get the list of favorite movies for the currently logged-in user
   * @returns  An Observable that emits an array of favorite movies
   */
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  /**
   * Add a movie to the list of favorite movies for the currently logged-in user
   * @param movieId  The ID of the movie to be added to favorites
   * @returns  An Observable that emits the result of adding the movie to favorites
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Check if a movie is in the list of favorite movies for the currently logged-in user
   * @param movieId The ID of the movie to check
   * @returns true if the movie is in the list of favorites, false otherwise
   */
  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  /**
   * Delete a movie from the list of favorite movies for the currently logged-in user
   * @param movieId  The ID of the movie to be removed from favorites
   * @returns  An Observable that emits the result of deleting the movie from favorites
   */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const index = user.FavoriteMovies.indexOf(movieId);
    if (index > -1) { //only splice array when item is found
      user.FavoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Edit user information for the currently logged-in user
   * @param updatedUser  The updated user information
   * @returns  An Observable that emits the result of editing the user information
   */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Delete the currently logged-in user
   * @returns An Observable that emits the result of deleting the user
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Extract response data from an HTTP response
   * @param res  The HTTP response
   * @returns  The extracted response data or an empty object if the response body is falsy
   */
  private extractResponseData(res: any) {
    const body = res;
    return body || {};
  }

  /**
   * Handle HTTP errors
   * @param error  The HTTP error response
   * @returns  An observable that emits an error message based on the type of error
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred: ', error.error.message);
    }
    else if (error.error.errors) {
      return throwError(() => new Error(error.error.erros[0].msg));
    }
    else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened. Please try again later.'));
  }
}
