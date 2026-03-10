import { TestBed } from '@angular/core/testing';

import { ContactsService } from './contacts';

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ContactsService] });
    service = TestBed.inject(ContactsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
