import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';
import { TranslatableStringService } from 'src/app/services/translatable-string.service';

import { ProgramMetrics } from 'src/app/models/program-metrics.model';
import { Program } from 'src/app/models/program.model';

import apiProgramsMock from 'src/app/mocks/api.programs.mock';
import { getRandomInt } from 'src/app/mocks/helpers';

import { MetricsComponent } from './metrics.component';

@Component({
  template: `<app-metrics [program]="program"></app-metrics>`,
})
class TestHostComponent {
  program: Program | any;
}

describe('MetricsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;
  let componentElement: HTMLElement;

  let mockProgramsApi: any;
  let mockTranslatableStringService: any;

  const fixtureProgram = apiProgramsMock.programs[0];
  const mockProgramMetrics: ProgramMetrics = {
    updated: new Date().toISOString(),
    pa: {
      included: getRandomInt(0, 100),
      excluded: getRandomInt(0, 100),
      startedEnlisting: getRandomInt(0, 100),
      finishedEnlisting: getRandomInt(0, 100),
      verified: getRandomInt(0, 100),
    },
    funding: {
      totalRaised: getRandomInt(0, 1000),
      totalTransferred: getRandomInt(0, 1000),
      totalAvailable: getRandomInt(0, 1000),
    },
  };

  beforeEach(async(() => {
    mockProgramsApi = jasmine.createSpyObj('ProgramsServiceApiService', [
      'getMetricsById',
    ]);
    mockProgramsApi.getMetricsById.and.returnValue(mockProgramMetrics);

    mockTranslatableStringService = jasmine.createSpyObj('TranslatableStringService', [
      'get',
    ]);
    mockTranslatableStringService.get.and.returnValue('');

    TestBed.configureTestingModule({
      declarations: [
        MetricsComponent,
        TestHostComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: TranslatableStringService,
          useValue: mockTranslatableStringService,
        },
        {
          provide: ProgramsServiceApiService,
          useValue: mockProgramsApi,
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    componentElement = fixture.nativeElement.querySelector('app-metrics');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(testHost).toBeTruthy();
  });

  it('should request the metrics for the provided program', () => {
    testHost.program = fixtureProgram;
    fixture.detectChanges();

    expect(mockProgramsApi.getMetricsById).toHaveBeenCalledWith(fixtureProgram.id);
  });

  it('should request the metrics (again) when triggered from the interface', () => {
    testHost.program = fixtureProgram;
    fixture.detectChanges();

    expect(mockProgramsApi.getMetricsById).toHaveBeenCalledTimes(1);

    document.getElementById('metrics-update').click();

    expect(mockProgramsApi.getMetricsById).toHaveBeenCalledTimes(2);
  });

});
