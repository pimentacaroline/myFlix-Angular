import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component to display information about a director.
 *
 * @component
 */

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss'],
})

export class DirectorInfoComponent implements OnInit {
  constructor(

    /**
     * Constructor to inject the director data into the component.
     *
     * @param {Object} data - The director data to be displayed.
     * @param {string} data.Name - The name of the director.
     * @param {string} data.Bio - The biography of the director.
     * @param {string} data.Birth - The director's date of birth.
     */

    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Bio: string;
      Birth: string;
    }
  ) { }

  /**
   * Angular's OnInit lifecycle hook. Logs the director data for debugging.
   */
  ngOnInit(): void {
    console.log('Director Data:', this.data);
  }
}