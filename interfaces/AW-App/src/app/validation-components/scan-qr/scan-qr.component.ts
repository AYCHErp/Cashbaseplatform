import { SessionStorageService } from './../../services/session-storage.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationComponent } from '../validation-components.interface';
import { ConversationService } from 'src/app/services/conversation.service';
import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';
import { ValidationComponents } from '../validation-components.enum';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.scss'],
})
export class ScanQrComponent implements ValidationComponent {

  public did: string;
  public programId: number;
  public scanError = false;
  public didResult = false;
  public unknownDidCombination = false;
  public returnMainMenu = false;


  constructor(
    private router: Router,
    public conversationService: ConversationService,
    public programsService: ProgramsServiceApiService,
    public sessionStorageService: SessionStorageService
  ) {
  }

  ngOnInit() {
    console.log('init scan qr');
    this.scanQrCode();
  }

  public scanQrCode() {
    const storageSubscription = this.sessionStorageService.watchStorage().subscribe(() => {
      this.checkScannedData();
      storageSubscription.unsubscribe();
      // this will call whenever your localStorage data changes
      // use localStorage code here and set your data here for ngFor
    });
    this.router.navigate(['/scan-qr']);
  }

  public async checkScannedData() {
    this.sessionStorageService.retrieve(this.sessionStorageService.type.scannedData).then(data => {
      if (this.isNotJson(data)) {
        this.scanError = true;
        return;
      }

      const jsonData = JSON.parse(data);

      if (!jsonData && !jsonData.did && !jsonData.programId) {
        this.scanError = true;
        console.log('this.scanError: ', this.scanError);
        return;
      }

      this.did = jsonData.did;
      this.programId = jsonData.programId;

      this.programsService.getPrefilledAnswers(this.did, this.programId).subscribe(response => {
        if (response.length === 0) {
          this.unknownDidCombination = true;
          console.log('this.scanError: unknownDidCombination');
          return;
        }

        this.didResult = true;
        this.unknownDidCombination = false;
        this.scanError = false;

        this.complete();
      });
    });
  }

  public backMainMenu() {
    this.returnMainMenu = true;
    this.conversationService.onSectionCompleted({
      name: ValidationComponents.scanQr,
      data: {
      },
      next: ValidationComponents.mainMenu,
    });
  }

  getNextSection() {
    return ValidationComponents.validateProgram;
  }

  isNotJson(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return true;
    }
    return false;
  }

  complete() {
    this.conversationService.onSectionCompleted({
      name: ValidationComponents.scanQr,
      data: {
      },
      next: this.getNextSection(),
    });
  }

}
