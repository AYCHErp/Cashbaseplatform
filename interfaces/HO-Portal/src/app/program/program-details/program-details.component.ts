import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableStringService } from 'src/app/services/translatable-string.service';
import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';
import { Program, ProgramPhase } from 'src/app/models/program.model';
import { ProgramJsonComponent } from '../program-json/program-json.component';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss'],
})
export class ProgramDetailsComponent implements OnChanges {
  @Input()
  public programId: number;
  @Input()
  public selectedPhase: string;

  public componentVisible: boolean;
  private presentInPhases = [
    ProgramPhase.design
  ];

  public program: Program;
  public programArray: any;

  private techFeatures = [
    'countryId',
    'schemaId',
    'credDefId',
    'credOffer',
    'proofRequest',
  ];

  constructor(
    public modalController: ModalController,
    public translate: TranslateService,
    private translatableString: TranslatableStringService,
    private programsService: ProgramsServiceApiService,
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedPhase && typeof changes.selectedPhase.currentValue === 'string') {
      this.checkVisibility(this.selectedPhase);
    }
    if (changes.programId && typeof changes.programId.currentValue === 'number') {
      this.update();
    }
  }

  private async update() {
    this.program = await this.programsService.getProgramById(this.programId);
    this.programArray = this.generateArray(this.program);
  }

  public checkVisibility(phase) {
    this.componentVisible = this.presentInPhases.includes(phase);
  }

  public generateArray(obj) {
    return Object.keys(obj)
      .filter((key) => this.techFeatures.indexOf(key) === -1)
      .map((key) => {
        return {
          key: this.translate.instant('page.program.program-details.' + key),
          value: this.translatableString.get(obj[key]),
        };
      });
  }

  async openProgramJson() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: ProgramJsonComponent,
        componentProps: {
          program: this.program,
        }
      });

    await modal.present();
  }

}
