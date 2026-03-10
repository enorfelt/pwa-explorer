import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportBadge } from './support-badge';

describe('SupportBadge', () => {
  let component: SupportBadge;
  let fixture: ComponentFixture<SupportBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportBadge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('level', 'supported');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
