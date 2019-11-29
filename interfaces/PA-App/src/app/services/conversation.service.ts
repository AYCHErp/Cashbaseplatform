import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { PaDataService } from './padata.service';

import { PersonalComponents } from '../personal-components/personal-components.enum';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  public state = {
    isLoading: false,
  };

  private history: ConversationSection[] = [];

  private conversation: ConversationSection[] = [];

  private updateConversationSource = new Subject<string>();
  public updateConversation$ = this.updateConversationSource.asObservable();
  public conversationActions = {
    afterLogin: 'after-login',
  };

  private shouldScrollSource = new Subject<number>();
  public shouldScroll$ = this.shouldScrollSource.asObservable();

  constructor(
    private paData: PaDataService,
  ) {
    console.log('ConversationService()');
  }

  public async getConversationUpToNow(): Promise<ConversationSection[]> {
    await this.init();
    return this.conversation;
  }

  private async init() {
    this.history = await this.getHistory();

    if (this.hasHistory()) {
      this.replayHistory();
    } else {
      this.startNewConversation();
    }
  }

  public startLoading() {
    this.state.isLoading = true;
    this.scrollToEnd();
  }

  public stopLoading() {
    this.state.isLoading = false;
  }

  public scrollToEnd() {
    this.shouldScrollSource.next(-1);
  }

  private async getHistory() {
    let history = await this.paData.retrieve(this.paData.type.conversationHistory);

    if (!history) {
      history = [];
    }

    return history;
  }

  private hasHistory() {
    return (this.history.length > 0);
  }

  private replayHistory() {
    // Always start with a clean slate:
    this.conversation = [];

    this.history.forEach((section: ConversationSection, index: number) => {
      this.addSection(section.name, section.moment, section.data);

      // Activate the next-section from the last-section-from-history
      if (index === this.history.length - 1) {
        this.addSection(section.next);
      }
    });
  }

  private startNewConversation() {
    this.conversation = [];
    this.addSection(PersonalComponents.selectLanguage);
  }

  private addSection(name: string, moment?: number, data?: any) {
    console.log('ConversationService addSection(): ', name, data);

    this.conversation.push({
      name,
      moment,
      data,
    });
  }

  private storeSection(section: ConversationSection) {
    this.history.push(section);

    this.paData.store(this.paData.type.conversationHistory, this.history);
  }

  public onSectionCompleted(section: ConversationSection) {
    console.log('ConverstaionService  onSectionCompleted(): ', section);

    // Record completion date/time:
    section.moment = Date.now();

    // Store all data from this section in history
    this.storeSection(section);

    // Instruct PersonalPage to insert the next section
    if (section.next) {
      this.updateConversationSource.next(section.next);
    }
  }

  public async restoreAfterLogin() {
    this.updateConversationSource.next(this.conversationActions.afterLogin);
  }

  public debugUndoLastStep() {
    this.history.pop();
    this.paData.store(this.paData.type.conversationHistory, this.history, true);
  }
}

export class ConversationSection {
  name: string;
  moment?: number;
  data?: any;
  next?: string;
}
