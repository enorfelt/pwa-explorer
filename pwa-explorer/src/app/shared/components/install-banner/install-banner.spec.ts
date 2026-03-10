import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallBanner } from './install-banner';

describe('InstallBanner', () => {
  let component: InstallBanner;
  let fixture: ComponentFixture<InstallBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(InstallBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
