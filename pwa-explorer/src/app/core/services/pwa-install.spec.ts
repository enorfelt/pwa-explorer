import { TestBed } from '@angular/core/testing';

import { PwaInstall } from './pwa-install';

describe('PwaInstall', () => {
  let service: PwaInstall;

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaInstall);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
