import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioMessageEntity } from '../twilio.entity';
import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';
import { AuthMiddlewareTwilio } from '../auth.middlewareTwilio';

@Module({
  imports: [TypeOrmModule.forFeature([
    TwilioMessageEntity
  ])],
  providers: [VoiceService],
  controllers: [VoiceController],
  exports: [VoiceService],
})
export class VoiceModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddlewareTwilio)
      .forRoutes({ path: 'voice/status', method: RequestMethod.POST });
  }
}
