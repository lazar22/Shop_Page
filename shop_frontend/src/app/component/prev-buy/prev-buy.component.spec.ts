import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevBuyComponent } from './prev-buy.component';

describe('PrevBuyComponent', () => {
  let component: PrevBuyComponent;
  let fixture: ComponentFixture<PrevBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevBuyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
