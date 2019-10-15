import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';

import { ProgramsServiceApiService } from '../services/programs-service-api.service';
import { ConversationService } from '../services/conversation.service';

import { ValidationComponents } from '../validation-components/validation-components.enum';
import { MainMenuComponent } from '../validation-components/main-menu/main-menu.component';
import { ScanQrComponent } from '../validation-components/scan-qr/scan-qr.component';
import { ViewAppointmentsComponent } from '../validation-components/view-appointments/view-appointments.component';
import { ValidateProgramComponent } from '../validation-components/validate-program/validate-program.component';

@Component({
  selector: 'app-validation',
  templateUrl: 'validation.page.html',
  styleUrls: ['validation.page.scss'],
})
export class ValidationPage implements OnInit {
  @ViewChild(IonContent)
  public ionContent: IonContent;

  @ViewChild('conversationContainer', { read: ViewContainerRef })
  public container;

  public isDebug: boolean = environment.isDebug;
  public showDebug: boolean = environment.showDebug;

  private scrollSpeed = environment.useAnimation ? 600 : 0;

  public availableSections = {
    [ValidationComponents.mainMenu]: MainMenuComponent,
    [ValidationComponents.scanQr]: ScanQrComponent,
    [ValidationComponents.validateProgram]: ValidateProgramComponent,
    [ValidationComponents.viewAppointments]: ViewAppointmentsComponent,
  };
  public debugSections = Object.keys(this.availableSections);

  constructor(
    public programsService: ProgramsServiceApiService,
    private conversationService: ConversationService,
    private resolver: ComponentFactoryResolver,
    private storage: Storage,
  ) {
    // Listen for completed sections, to continue with next steps
    this.conversationService.sectionCompleted$.subscribe((response: string) => {
      this.insertSection(response);
    });
    // Listen for scroll events
    this.conversationService.shouldScroll$.subscribe((toY: number) => {
      if (toY === -1) {
        return this.ionContent.scrollToBottom(this.scrollSpeed);
      }

      this.ionContent.scrollToPoint(0, toY, this.scrollSpeed);
    });
  }

  ngOnInit() {
    this.loadComponents();
  }

  ionViewDidEnter() {
    this.scrollDown();
  }

  private loadComponents() {
    const steps = this.conversationService.getConversationUpToNow();

    for (const step of steps) {
      this.insertSection(step.name);
    }
  }

  private getComponentFactory(name: string) {
    return this.resolver.resolveComponentFactory(
      this.availableSections[name]
    );
  }

  public insertSection(name: string) {
    if (!name) {
      return;
    }

    console.log('ValidationPage insertSection(): ', name);

    this.scrollDown();

    this.container.createComponent(
      this.getComponentFactory(name)
    );
  }

  public scrollDown() {
    this.ionContent.scrollToBottom(this.scrollSpeed);
  }

  public debugClearAllStorage() {
    this.storage.clear();
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
}
