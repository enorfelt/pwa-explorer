import { TestBed } from '@angular/core/testing';

import { CapabilityDetection } from './capability-detection';

describe('CapabilityDetection', () => {
  let service: CapabilityDetection;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapabilityDetection);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
