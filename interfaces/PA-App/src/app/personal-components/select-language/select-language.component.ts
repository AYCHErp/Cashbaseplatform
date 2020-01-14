import { Component, Input } from '@angular/core';
import { PersonalComponent } from '../personal-component.class';
import { PersonalComponents } from '../personal-components.enum';

import { PaDataService } from 'src/app/services/padata.service';
import { TranslateService } from '@ngx-translate/core';
import { ConversationService } from 'src/app/services/conversation.service';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
})
export class SelectLanguageComponent extends PersonalComponent {
  @Input()
  public data: any;

  public languages: any;
  public languageChoice: string;
  public languageChoiceName: string;

  constructor(
    public paData: PaDataService,
    public translate: TranslateService,
    public conversationService: ConversationService,
  ) {
    super();
  }

  ngOnInit() {
    this.languages = [
      {
        id: 'en',
        language: this.translate.instant('personal.select-language.option1'),
      },
      {
        id: 'la2',
        language: this.translate.instant('personal.select-language.option2'),
      },
      {
        id: 'la3',
        language: this.translate.instant('personal.select-language.option3'),
      },
    ];

    if (this.data) {
      this.initHistory();
    }
  }

  initHistory() {
    this.languageChoice = this.data.languageChoice;
    this.languageChoiceName = this.getLanguageName(this.data.languageChoice);
    this.isDisabled = true;
  }

  public getLanguageName(languageId: string): string {
    const language = this.languages.find(item => {
      return item.id === languageId;
    });

    return language ? language.language : '';
  }

  public changeLanguage($event) {
    this.languageChoice = $event.detail.value;
    this.isDisabled = false;

    this.translate.use(this.languageChoice);
    this.languageChoiceName = this.getLanguageName(this.languageChoice);

    this.paData.store(this.paData.type.language, this.languageChoice, true);
  }

  public submitLanguage() {
    this.complete();
  }

  getNextSection() {
    return PersonalComponents.signupSignin;
  }

  complete() {
    this.isDisabled = true;
    this.conversationService.onSectionCompleted({
      name: PersonalComponents.selectLanguage,
      data: {
        languageChoice: this.languageChoice,
      },
      next: this.getNextSection(),
    });
  }
}
