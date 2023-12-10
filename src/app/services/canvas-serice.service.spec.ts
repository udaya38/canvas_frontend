import { TestBed } from '@angular/core/testing';

import { CanvasSericeService } from './canvas-serice.service';

describe('CanvasSericeService', () => {
  let service: CanvasSericeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasSericeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
