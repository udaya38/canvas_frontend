import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordPickerComponent } from './word-picker.component';

describe('WordPickerComponent', () => {
  let component: WordPickerComponent;
  let fixture: ComponentFixture<WordPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordPickerComponent]
    });
    fixture = TestBed.createComponent(WordPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
