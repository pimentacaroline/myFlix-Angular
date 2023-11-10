import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreInfoComponent } from './genre-info.component';

describe('GenreInfoComponent', () => {
  let component: GenreInfoComponent;
  let fixture: ComponentFixture<GenreInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenreInfoComponent]
    });
    fixture = TestBed.createComponent(GenreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
