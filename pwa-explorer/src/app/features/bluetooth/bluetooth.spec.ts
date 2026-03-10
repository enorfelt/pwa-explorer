import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bluetooth } from './bluetooth';

describe('Bluetooth', () => {
  let component: Bluetooth;
  let fixture: ComponentFixture<Bluetooth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bluetooth],
    }).compileComponents();

    fixture = TestBed.createComponent(Bluetooth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
