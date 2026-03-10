import { TestBed } from '@angular/core/testing';

import { BluetoothService } from './bluetooth';

describe('BluetoothService', () => {
  let service: BluetoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BluetoothService] });
    service = TestBed.inject(BluetoothService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
