import { TestBed } from '@angular/core/testing';

import { DeviceMotion } from './device-motion';

describe('DeviceMotion', () => {
  let service: DeviceMotion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceMotion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
