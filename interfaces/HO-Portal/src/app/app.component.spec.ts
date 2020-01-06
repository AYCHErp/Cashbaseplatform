import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './auth/auth.service';

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AuthService,
        },
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
    }).compileComponents();
  }));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have menu items', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-menu ion-list ion-label');
    expect(menuItems.length).toEqual(4);
  });

  it('should have menu labels', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-menu ion-list ion-label');
    expect(menuItems[0].textContent).toContain('page.home.pageTitle');
    expect(menuItems[1].textContent).toContain('page.programs.program-list.pageTitle');
    expect(menuItems[2].textContent).toContain('page.help.pageTitle');
    expect(menuItems[3].textContent).toContain('LOGOUT');
  });

  it('should have urls', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/home');
    expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/programs');
    expect(menuItems[2].getAttribute('ng-reflect-router-link')).toEqual('/help');
  });

});
