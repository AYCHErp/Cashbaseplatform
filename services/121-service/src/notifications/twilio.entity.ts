import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum NotificationType {
  Sms = 'sms',
  Call = 'call',
}

@Entity('twilio-message')
export class TwilioMessageEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public accountSid: string;

  @Column()
  public body: string;

  @Column()
  public to: string;

  @Column()
  public from: string;

  @Column()
  public sid: string;

  @Column()
  public status: string;

  @Column()
  public type: NotificationType;

  @Column({ type: 'timestamp' })
  dateCreated: Date;
}
