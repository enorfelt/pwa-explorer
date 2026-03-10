import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CapabilityCard } from './capability-card';

describe('CapabilityCard', () => {
  let component: CapabilityCard;
  let fixture: ComponentFixture<CapabilityCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapabilityCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CapabilityCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('capability', {
      id: 'test',
      name: 'Test',
      description: 'Test capability',
      icon: 'check',
      route: '/test',
      category: 'system',
      supportLevel: 'supported',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
