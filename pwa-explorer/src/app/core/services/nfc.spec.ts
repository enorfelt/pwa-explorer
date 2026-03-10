import { TestBed } from '@angular/core/testing';

import { NfcService } from './nfc';

describe('NfcService', () => {
  let service: NfcService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NfcService] });
    service = TestBed.inject(NfcService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
