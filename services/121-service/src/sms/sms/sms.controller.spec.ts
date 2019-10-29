import { Test, TestingModule } from '@nestjs/testing';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

class SmsServiceMock {}

describe('Sms Controller', () => {
  let smsController: SmsController;
  let smsService: SmsService;

  beforeEach(
    async (): Promise<void> => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [SmsController],
        providers: [
          {
            provide: SmsService,
            useValue: new SmsServiceMock(),
          },
        ],
      }).compile();
      smsService = module.get<SmsService>(SmsService);
      smsController = module.get<SmsController>(SmsController);
    },
  );

  it('should be defined', () => {
    expect(smsController).toBeDefined();
  });
});
