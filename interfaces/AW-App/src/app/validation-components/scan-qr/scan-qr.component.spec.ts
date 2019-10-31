import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Storage } from '@ionic/storage';

import { ScanQrComponent } from './scan-qr.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ScanQrComponent', () => {
  let component: ScanQrComponent;
  let fixture: ComponentFixture<ScanQrComponent>;

  const storageIonicMock: any = {
    get: () => new Promise<any>((resolve) => resolve('1')),
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanQrComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Storage,
          useValue: storageIonicMock,
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
