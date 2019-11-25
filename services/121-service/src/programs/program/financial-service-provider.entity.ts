import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { ProgramEntity } from './program.entity';

@Entity('fsp')
export class FinancialServiceProviderEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public fsp: string;

  @ManyToMany(_type => ProgramEntity, program => program.financialServiceProviders)
  public program: ProgramEntity[];
}