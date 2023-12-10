import { TestBed } from '@angular/core/testing';

import { CanvasSocketServiceService } from './canvas-socket-service.service';

describe('CanvasSocketServiceService', () => {
  let service: CanvasSocketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasSocketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
