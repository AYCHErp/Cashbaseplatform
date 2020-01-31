import { AnswerType } from './q-and-a.models';
import { TranslatableString } from './translatable-string.model';

export class Fsp {
  id: number;
  fsp: string;
  attributes?: FspAttribute[];
}

export class FspAttribute {
  id: number;
  name: string;
  answerType: AnswerType;
  label: TranslatableString;
  options: FspAttributeOption[] | null;
}

export class FspAttributeOption {
  option: string;
  label: TranslatableString;
}
