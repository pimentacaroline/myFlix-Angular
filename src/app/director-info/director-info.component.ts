import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * The DirectorInfoComponent is responsible for rendering detailed information about a movie director.
 * It displays information such as the director's name, bio, and birthdate.
 */
@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss'],
})

export class DirectorInfoComponent implements OnInit {
 
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Bio: string;
      Birth: string;
    }
  ) { }

  ngOnInit(): void {
    console.log('Director Data:', this.data);
  }
}