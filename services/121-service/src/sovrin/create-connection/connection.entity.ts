
import { TransactionEntity } from '../../programs/program/transactions.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeUpdate } from 'typeorm';
import { FinancialServiceProviderEntity } from '../../programs/fsp/financial-service-provider.entity';

@Entity('connection')
export class ConnectionEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public did: string;

  @Column({ nullable: true })
  public phoneNumber: string;

  @Column({ nullable: true })
  public preferredLanguage: string;

  @ManyToOne(type => FinancialServiceProviderEntity, financialServiceProvider => financialServiceProvider.connection)
  public fsp: FinancialServiceProviderEntity;

  @Column({ nullable: true })
  public inclusionScore: number;

  @Column('numeric', {
    array: true,
    default: () => 'array[]::integer[]',
    nullable: true,
  })
  public programsEnrolled: number[];

  @Column('numeric', {
    array: true,
    default: () => 'array[]::integer[]',
    nullable: true,
  })
  public programsIncluded: number[];

  @Column('numeric', {
    array: true,
    default: () => 'array[]::integer[]',
    nullable: true,
  })
  public programsExcluded: number[];

  @Column('json', {
    default: {}
  })
  public customData: JSON;

  @OneToMany(type => TransactionEntity, transactions => transactions.connection)
  public transactions: TransactionEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public updated: Date;

  @BeforeUpdate()
  public updateTimestamp(): void {
    this.updated = new Date();
  }
}
