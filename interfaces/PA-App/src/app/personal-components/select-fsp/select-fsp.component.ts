import { Component, Input } from '@angular/core';
import { PersonalComponents } from '../personal-components.enum';

import { ConversationService } from 'src/app/services/conversation.service';
import { PaDataService } from 'src/app/services/padata.service';

import { Program } from 'src/app/models/program.model';
import { Fsp, FspAttribute, FspAttributeOption } from 'src/app/models/fsp.model';
import { PersonalComponent } from '../personal-component.class';
import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';
import { Question, QuestionOption, Answer, AnswerSet } from 'src/app/models/q-and-a.models';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableString } from 'src/app/models/translatable-string.model';

@Component({
  selector: 'app-select-fsp',
  templateUrl: './select-fsp.component.html',
  styleUrls: ['./select-fsp.component.scss'],
})
export class SelectFspComponent extends PersonalComponent {
  @Input()
  public data: any;

  public languageCode: string;
  public fallbackLanguageCode: string;

  private did: string;
  public program: Program;
  public fsps: Fsp[];

  public fspChoice: number;
  public chosenFsp: Fsp;
  public fspSubmitted: boolean;

  public questions: Question[];
  public customAttributeAnswers: Answer[];
  public isSubmitted: boolean;
  public isEditing: boolean;
  public showResultSuccess: boolean;
  public showResultError: boolean;

  constructor(
    public conversationService: ConversationService,
    public programsService: ProgramsServiceApiService,
    public paData: PaDataService,
    public translate: TranslateService,
  ) {
    super();
  }

  async ngOnInit() {
    this.fallbackLanguageCode = this.translate.getDefaultLang();
    this.languageCode = this.translate.currentLang;
    this.program = await this.paData.getCurrentProgram();

    if (this.data) {
      this.initHistory();
      return;
    }

    this.initNew();
  }

  async initNew() {
    this.conversationService.startLoading();
    this.fsps = this.program.financialServiceProviders;
    this.did = await this.paData.retrieve(this.paData.type.did);
    this.conversationService.stopLoading();
  }

  async initHistory() {
    this.isDisabled = true;
    this.fspSubmitted = true;
    this.chosenFsp = this.data.fsp;
    this.fspChoice = this.data.fsp.id;
    this.fsps = [this.data.fsp];
    this.questions = this.buildQuestions(this.chosenFsp.attributes);
    this.customAttributeAnswers = this.data.customAttributeAnswers;
    this.isSubmitted = true;
  }

  private getFspById(fspId: number) {
    return this.fsps.find((item: Fsp) => item.id === fspId);
  }

  public changeFsp($event) {
    if (this.isDisabled) {
      return;
    }

    this.fspChoice = parseInt($event.detail.value, 10);
    this.fspSubmitted = false;

    this.chosenFsp = this.getFspById(this.fspChoice);
    this.paData.store(this.paData.type.fsp, this.chosenFsp);
  }

  public async submitFsp() {
    this.fspSubmitted = true;

    this.programsService.postFsp(this.did, this.fspChoice);

    // Update FSPs with more details:
    this.chosenFsp = await this.programsService.getFspById(this.fspChoice);

    if (!this.chosenFsp.attributes.length) {
      return this.complete();
    }

    this.questions = this.buildQuestions(this.chosenFsp.attributes);
  }

  private buildQuestions(fspAttributes: FspAttribute[]) {
    return fspAttributes.map((attribute): Question => {
      return {
        code: attribute.name,
        answerType: attribute.answerType,
        label: this.mapLabelByLanguageCode(attribute.label),
        options: (!attribute.options) ? null : this.buildOptions(attribute.options),
      };
    });
  }

  private buildOptions(optionSet: FspAttributeOption[]): QuestionOption[] {
    return optionSet.map((option): QuestionOption => {
      return {
        value: option.option,
        label: this.mapLabelByLanguageCode(option.label),
      };
    });
  }

  private mapLabelByLanguageCode(property: TranslatableString | string): string {
    let label = property[this.languageCode];

    if (!label) {
      label = property[this.fallbackLanguageCode];
    }

    if (!label) {
      label = property;
    }

    return label;
  }

  private processInOrder(array: any[], fn) {
    return array.reduce(
      (request, item) => request.then(() => fn(item)),
      Promise.resolve()
    );
  }

  public async submitCustomAttributes($event: AnswerSet) {
    this.conversationService.startLoading();
    this.customAttributeAnswers = Object.values($event);

    this.showResultSuccess = null;
    this.showResultError = null;

    // Treat phoneNumber as a special case, to enable reuse later:
    await this.storePhoneNumber();

    this.processInOrder(
      this.customAttributeAnswers,
      (answer: Answer) => this.programsService.postConnectionCustomAttribute(this.did, answer.code, answer.value)
    ).then(
      () => {
        // in case of success:
        this.isSubmitted = true;
        this.isEditing = false;
        this.showResultSuccess = true;
        this.showResultError = false;
        this.complete();
      },
      () => {
        // in case of error:
        this.isSubmitted = false;
        this.isEditing = true;
        this.showResultSuccess = false;
        this.showResultError = true;
      }
    ).finally(() => {
      this.conversationService.stopLoading();
    });

  }

  private async storePhoneNumber() {
    const phoneNumberAnswer = this.customAttributeAnswers.find((answer: Answer) => {
      return (answer.code === this.paData.type.phoneNumber);
    });

    if (phoneNumberAnswer) {
      return await this.paData.store(this.paData.type.phoneNumber, phoneNumberAnswer.value);
    }
  }

  getNextSection() {
    return PersonalComponents.setNotificationNumber;
  }

  complete() {
    this.conversationService.onSectionCompleted({
      name: PersonalComponents.selectFsp,
      data: {
        fsp: this.chosenFsp,
        customAttributeAnswers: this.customAttributeAnswers,
      },
      next: this.getNextSection(),
    });
  }

}
