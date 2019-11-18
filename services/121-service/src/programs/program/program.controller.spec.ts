import { CreateProgramDto } from './dto/create-program.dto';
import { Test } from '@nestjs/testing';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';
import { ProgramEntity } from './program.entity';
import { ProgramRO, ProgramsRO, SimpleProgramRO } from './program.interface';

const newProgramParameters = {
  location: 'Lilongwe',
  ngo: 'Dorcas',
  countryId: 265,
  title: JSON.parse('{"en": "pilot_program_1a"}'),
  description: JSON.parse(
    '{"en": "Program to help people hit by earthquake examplename"}',
  ),
  descLocation: JSON.parse(
    '{"en": "Specification of location"}',
  ),
  descHumanitarianObjective: JSON.parse(
    '{"en": "Specification of hum. obj."}',
  ),
  descCashType: JSON.parse(
    '{"en": "Specification of cash type: Unconditional multi-purpose"}',
  ),
  startDate: new Date(),
  endDate: new Date(),
  currency: 'MWK',
  distributionFrequency: 'month',
  distributionDuration: 3,
  fixedTransferValue: JSON.parse('[500, 500, 500]'),
  financialServiceProviders: JSON.parse('{}'),
  protectionServiceProviders: JSON.parse('{}'),
  inclusionCalculationType: 'highestScoresX', // Only option for now later, it can also be a fancy algorithm
  minimumScore: 0,
  highestScoresX: 500,
  meetingDocuments: JSON.parse('{"en": "documents"}'),
  customCriteria: [],
};

const newSimpleProgramRO = {
  id: 1,
  title: JSON.parse('{"en": "title"}'),
  published: true,
}

class ProgramServiceMock {
  public async findOne(query): Promise<ProgramEntity> {
    query;
    return new ProgramEntity();
  }
  public async findAll(query): Promise<ProgramsRO> {
    query;
    return { programs: [new ProgramEntity()], programsCount: 1 };
  }
  public async create(
    userId: number,
    programData: CreateProgramDto,
  ): Promise<ProgramEntity> {
    userId;
    programData;
    return new ProgramEntity();
  }
  public async update(id: number, programData: any): Promise<ProgramRO> {
    id;
    programData;
    return { program: new ProgramEntity() };
  }
  public async publish(id: number): Promise<void> {
    id;
  }
  public async unpublish(id: number): Promise<void> {
    id;
  }
}

describe('ProgramController', (): void => {
  let programController: ProgramController;
  let programService: ProgramService;

  beforeEach(
    async (): Promise<void> => {
      const module = await Test.createTestingModule({
        controllers: [ProgramController],
        providers: [
          {
            provide: ProgramService,
            useValue: new ProgramServiceMock(),
          },
        ],
      }).compile();

      programService = module.get<ProgramService>(ProgramService);
      programController = module.get<ProgramController>(ProgramController);
    },
  );

  describe('findOne', (): void => {
    it('should return an object with a count and and array of programs', async (): Promise<
      void
    > => {
      const program = new ProgramEntity();

      const spy = jest
        .spyOn(programService, 'findOne')
        .mockImplementation(
          (): Promise<ProgramEntity> => Promise.resolve(program),
        );

      const controllerResult = await programController.findOne(['']);
      expect(spy).toHaveBeenCalled();
      expect(controllerResult).toStrictEqual(program);
    });
  });

  describe('findAll', (): void => {
    it('should return an object with a count and and array of programs', async (): Promise<
      void
    > => {
      const program = new ProgramEntity();
      const programsAll: ProgramsRO = {
        programs: [program],
        programsCount: 1,
      };
      const spy = jest
        .spyOn(programService, 'findAll')
        .mockImplementation(
          (): Promise<ProgramsRO> => Promise.resolve(programsAll),
        );

      const controllerResult = await programController.findAll(['']);
      expect(spy).toHaveBeenCalled();
      expect(controllerResult).toStrictEqual(programsAll);
    });
  });
  describe('create', (): void => {
    it('should create a program and then return that program', async (): Promise<
      void
    > => {
      const program = new ProgramEntity();
      const spy = jest
        .spyOn(programService, 'create')
        .mockImplementation(
          (): Promise<ProgramEntity> => Promise.resolve(program),
        );

      const controllerResult = await programController.create(
        0,
        newProgramParameters,
      );
      expect(spy).toHaveBeenCalled();
      expect(controllerResult).toStrictEqual(program);
    });
  });

  describe('update', (): void => {
    it('should update a program and then return that program', async (): Promise<
      void
    > => {
      const programRO = {
        program: new ProgramEntity(),
      };
      const spy = jest
        .spyOn(programService, 'update')
        .mockImplementation(
          (): Promise<ProgramRO> => Promise.resolve(programRO),
        );

      const controllerResult = await programController.update(
        0,
        0,
        newProgramParameters,
      );
      expect(spy).toHaveBeenCalled();
      expect(controllerResult).toStrictEqual(programRO);
    });
  });
  describe('publish', (): void => {
    it('should publish a program', async (): Promise<void> => {
      const spy = jest
        .spyOn(programService, 'publish')
        .mockImplementation((): Promise<SimpleProgramRO> => Promise.resolve(newSimpleProgramRO));

      await programController.publish(1);
      expect(spy).toHaveBeenCalled();
    });
  });
  describe('unpublish', (): void => {
    it('should publish a program', async (): Promise<void> => {
      const spy = jest
        .spyOn(programService, 'unpublish')
        .mockImplementation((): Promise<SimpleProgramRO> => Promise.resolve(newSimpleProgramRO));

      await programController.unpublish(1);
      expect(spy).toHaveBeenCalled();
    });
  });
});
