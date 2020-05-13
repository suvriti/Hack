import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerBookComponent } from './ledger-book.component';

describe('LedgerBookComponent', () => {
  let component: LedgerBookComponent;
  let fixture: ComponentFixture<LedgerBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
