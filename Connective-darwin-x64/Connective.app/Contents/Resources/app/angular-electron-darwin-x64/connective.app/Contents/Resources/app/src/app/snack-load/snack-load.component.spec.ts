import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackLoadComponent } from './snack-load.component';

describe('SnackLoadComponent', () => {
  let component: SnackLoadComponent;
  let fixture: ComponentFixture<SnackLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
