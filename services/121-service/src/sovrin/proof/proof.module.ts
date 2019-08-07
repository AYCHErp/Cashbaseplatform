import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProofController } from './proof.controller';
import { ProofService } from './proof.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramEntity } from '../../programs/program/program.entity';
import { CustomCriterium } from '../../programs/program/custom-criterium.entity';
import { UserEntity } from '../../user/user.entity';
import { ConnectionEntity } from '../create-connection/connection.entity';
import { UserModule } from '../../user/user.module';
import { ProgramModule } from '../../programs/program/program.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProgramEntity,
      CustomCriterium,
      UserEntity,
      ConnectionEntity,
    ]),
    UserModule,
    ProgramModule,
  ],
  controllers: [ProofController],
  providers: [ProofService],
})
export class ProofModule {}
