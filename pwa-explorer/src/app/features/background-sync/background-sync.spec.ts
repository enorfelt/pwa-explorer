import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSync } from './background-sync';

describe('BackgroundSync', () => {
  let component: BackgroundSync;
  let fixture: ComponentFixture<BackgroundSync>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundSync],
    }).compileComponents();

    fixture = TestBed.createComponent(BackgroundSync);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
