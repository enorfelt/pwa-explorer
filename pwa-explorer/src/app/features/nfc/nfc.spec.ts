import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nfc } from './nfc';

describe('Nfc', () => {
  let component: Nfc;
  let fixture: ComponentFixture<Nfc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nfc],
    }).compileComponents();

    fixture = TestBed.createComponent(Nfc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
