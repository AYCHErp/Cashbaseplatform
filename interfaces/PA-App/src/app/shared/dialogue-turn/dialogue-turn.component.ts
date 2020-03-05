import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

enum Actor {
  system = 'system',
  self = 'self',
}

@Component({
  selector: 'dialogue-turn',
  templateUrl: './dialogue-turn.component.html',
  styleUrls: ['./dialogue-turn.component.scss'],
})
export class DialogueTurnComponent implements OnInit {
  @Input()
  isSpoken = false;

  @Input()
  actor = Actor.system;

  @Input()
  moment: Date;

  @Input()
  isConnected = false;

  isSelf: boolean;
  isSystem: boolean;

  animate = environment.useAnimation;

  constructor() {
  }

  ngOnInit() {
    this.isSelf = (this.actor === Actor.self);
    this.isSystem = (this.actor === Actor.system);
    this.moment = new Date();
  }

  show() {
    this.isSpoken = true;
  }
}
