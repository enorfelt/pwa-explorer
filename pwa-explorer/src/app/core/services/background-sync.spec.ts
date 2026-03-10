import { TestBed } from '@angular/core/testing';

import { BackgroundSyncService } from './background-sync';

describe('BackgroundSyncService', () => {
  let service: BackgroundSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BackgroundSyncService] });
    service = TestBed.inject(BackgroundSyncService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
