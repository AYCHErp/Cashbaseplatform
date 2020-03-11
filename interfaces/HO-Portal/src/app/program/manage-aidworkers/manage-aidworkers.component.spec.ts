import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ManageAidworkersComponent } from './manage-aidworkers.component';

describe('ManageAidworkersComponent', () => {
  let component: ManageAidworkersComponent;
  let fixture: ComponentFixture<ManageAidworkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAidworkersComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAidworkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
