import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component to display information about a movie genre.
 *
 * @component
 */
@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss'],
})
export class GenreInfoComponent implements OnInit {
  
   /**
   * Constructor to inject the genre data into the component.
   *
   * @param {Object} data
   * @param {any} data.Genre 
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Description: string;
    }
  ) {}

  /**
   * Angular's OnInit lifecycle hook. Logs the genre data for debugging.
   */
  ngOnInit(): void {

  }
}