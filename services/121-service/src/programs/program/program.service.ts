import { CustomCriterium } from './custom-criterium.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ProgramEntity } from './program.entity';
import { UserEntity } from '../../user/user.entity';
import { CreateProgramDto } from './dto';

import { ProgramRO, ProgramsRO, SimpleProgramRO } from './program.interface';
import { SchemaService } from '../../sovrin/schema/schema.service';

@Injectable()
export class ProgramService {
  @InjectRepository(ProgramEntity)
  private readonly programRepository: Repository<ProgramEntity>;
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;
  @InjectRepository(CustomCriterium)
  public customCriteriumRepository: Repository<CustomCriterium>;
  public constructor() {}

  public async findOne(where): Promise<ProgramEntity> {
    const qb = await getRepository(ProgramEntity)
      .createQueryBuilder('program')
      .leftJoinAndSelect('program.customCriteria', 'customCriterium');
    qb.whereInIds([where]);
    const program = qb.getOne();
    return program;
  }

  public async findAll(query): Promise<ProgramsRO> {
    const qb = await getRepository(ProgramEntity)
      .createQueryBuilder('program')
      .leftJoinAndSelect('program.customCriteria', 'customCriterium');

    qb.where('1 = 1');

    if ('location' in query) {
      qb.andWhere('lower(program.location) LIKE :location', {
        location: `%${query.location.toLowerCase()}%`,
      });
    }

    if ('countryId' in query) {
      qb.andWhere('program.countryId = :countryId', {
        countryId: query.countryId,
      });
    }

    qb.orderBy('program.created', 'DESC');

    const programsCount = await qb.getCount();
    const programs = await qb.getMany();

    return { programs, programsCount };
  }

  public async findByCountry(query): Promise<ProgramsRO> {
    const qb = await getRepository(ProgramEntity)
      .createQueryBuilder('program')
      .leftJoinAndSelect('program.customCriteria', 'customCriterium')
      .where('"countryId" = :countryId', { countryId: query })
      .andWhere('published = true');

    const programsCount = await qb.getCount();
    const programs = await qb.getMany();
    return { programs, programsCount };
  }

  public async create(
    userId: number,
    programData: CreateProgramDto,
  ): Promise<ProgramEntity> {
    let program = new ProgramEntity();
    program.location = programData.location;
    program.title = programData.title;
    program.startDate = programData.startDate;
    program.endDate = programData.endDate;
    program.currency = programData.currency;
    program.distributionFrequency = programData.distributionFrequency;
    program.distributionChannel = programData.distributionChannel;
    program.notifiyPaArea = programData.notifiyPaArea;
    program.notificationType = programData.notificationType;
    program.cashDistributionSites = programData.cashDistributionSites;
    program.financialServiceProviders = programData.financialServiceProviders;
    program.inclusionCalculationType = programData.inclusionCalculationType;
    program.minimumScore = programData.minimumScore;
    program.description = programData.description;
    program.countryId = programData.countryId;
    program.customCriteria = [];

    const author = await this.userRepository.findOne(userId);
    program.author = author;

    for (let customCriterium of programData.customCriteria) {
      let customReturn = await this.customCriteriumRepository.save(
        customCriterium,
      );
      program.customCriteria.push(customReturn);
    }

    const newProgram = await this.programRepository.save(program);
    return newProgram;
  }

  public async update(id: number, programData: any): Promise<ProgramRO> {
    let toUpdate = await this.programRepository.findOne({ id: id });
    let updated = Object.assign(toUpdate, programData);
    const program = await this.programRepository.save(updated);
    return { program };
  }

  public async delete(programId: number): Promise<DeleteResult> {
    return await this.programRepository.delete(programId);
  }

  public async publish(programId: number): Promise<SimpleProgramRO> {
    const selectedProgram = await this.findOne(programId);
    if (selectedProgram.published == true) {
      const errors = { Program: ' already published' };
      throw new HttpException({ errors }, 401);
    }

    await this.changeProgramValue(programId, { published: true });

    const schemaService = new SchemaService();

    const result = await schemaService.create(selectedProgram);
    await this.changeProgramValue(programId, { schemaId: result.schemaId });
    await this.changeProgramValue(programId, { credDefId: result.credDefId });
    
    return await this.buildProgramRO(selectedProgram); 
  }

  public async unpublish(programId: number): Promise<SimpleProgramRO> {
    let selectedProgram = await this.findOne(programId);
    if (selectedProgram.published == false) {
      const errors = { Program: ' already unpublished' };
      throw new HttpException({ errors }, 401);
    }
    await this.changeProgramValue(programId, { published: false });
    return await this.buildProgramRO(selectedProgram); 
  }

  private async changeProgramValue(
    programId: number,
    change: object,
  ): Promise<void> {
    await getRepository(ProgramEntity)
      .createQueryBuilder()
      .update(ProgramEntity)
      .set(change)
      .where('id = :id', { id: programId })
      .execute();
  }

  private buildProgramRO(program: ProgramEntity): SimpleProgramRO {
    const simpleProgramRO = {
      id: program.id,
      title: program.title,
      published: program.published
    };

    return simpleProgramRO;
  }
}
