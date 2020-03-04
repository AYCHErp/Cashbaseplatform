import { Component, Input } from '@angular/core';
import { PersonalComponent } from '../personal-component.class';
import { PersonalComponents } from '../personal-components.enum';

import { ConversationService } from 'src/app/services/conversation.service';
import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';
import { PaDataService } from 'src/app/services/padata.service';

import { Timeslot } from 'src/app/models/timeslot.model';
import { Program } from 'src/app/models/program.model';
import { TranslatableStringService } from 'src/app/services/translatable-string.service';

@Component({
  selector: 'app-meeting-reminder',
  templateUrl: './meeting-reminder.component.html',
  styleUrls: ['./meeting-reminder.component.scss'],
})
export class MeetingReminderComponent extends PersonalComponent {
  @Input()
  public data: any;

  private did: string;

  public dateFormat = 'EEE, dd-MM-yyyy';
  public timeFormat = 'HH:mm';

  public program: Program;
  public meetingDocuments: string[];

  public chosenTimeslot: Timeslot;
  public daysToMeeting: number;

  public qrDataString: string;
  public qrDataShow = false;

  constructor(
    public conversationService: ConversationService,
    public programsService: ProgramsServiceApiService,
    public translatableString: TranslatableStringService,
    public paData: PaDataService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.data) {
      this.initHistory();
      return;
    }
    this.initNew();
  }

  async initNew() {
    await this.getDid();
    await this.getProgram();
    await this.generateContent();
    await this.programsService.postConnectionApply(this.did, this.program.id);
    this.complete();
  }

  async initHistory() {
    this.isDisabled = this.data.isDisabled;

    // There is no difference between first use and future use of this component:
    this.initNew();
  }

  private async getDid() {
    this.did = await this.paData.retrieve(this.paData.type.did);
  }

  private async getProgram() {
    this.conversationService.startLoading();
    this.program = await this.paData.getCurrentProgram();
    this.getProgramProperties(this.program);
  }

  private getProgramProperties(program: Program) {
    const documents = this.translatableString.get(program.meetingDocuments);
    this.meetingDocuments = this.buildDocumentsList(documents);
  }

  private buildDocumentsList(documents: string): string[] {
    return documents.split(';');
  }

  private generateQrCode(did: string, programId: number) {
    const qrData = {
      did,
      programId,
    };

    this.qrDataString = JSON.stringify(qrData);
    this.qrDataShow = true;
  }

  private getDaysToAppointment(appointmentDate: Date) {
    const currentDate = new Date();
    const chosenDate = new Date(appointmentDate);
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

    currentDate.setHours(0, 0, 0, 0);
    chosenDate.setHours(0, 0, 0, 0);

    const diff = chosenDate.getTime() - currentDate.getTime();

    return Math.round(Math.abs(diff / oneDay));
  }

  public async generateContent() {
    this.conversationService.startLoading();

    this.generateQrCode(this.did, this.program.id);

    this.chosenTimeslot = await this.paData.retrieve(this.paData.type.timeslot);
    this.daysToMeeting = this.getDaysToAppointment(this.chosenTimeslot.startDate);

    this.conversationService.stopLoading();
  }

  getNextSection() {
    return PersonalComponents.storeCredential;
  }

  complete() {
    if (this.isDisabled) {
      return;
    }

    this.isDisabled = true;
    this.conversationService.onSectionCompleted({
      name: PersonalComponents.meetingReminder,
      data: {
        isDisabled: this.isDisabled,
      },
      next: this.getNextSection(),
    });
  }

}
