import { SchemaEntity } from './schema.entity';
import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { API, DEBUG } from '../../config';

@Injectable()
export class SchemaService {
  @InjectRepository(SchemaEntity)
  private readonly schemaRepository: Repository<SchemaEntity>;

  public constructor(private readonly httpService: HttpService) {}

  public async create(program): Promise<any> {
    let attributes = [];
    for (let criterium of program.customCriteria) {
      attributes.push(criterium.criterium);
    }

    // Increment version number based on previous version
    let version: string;
    if (program.schemaId) {
      const n = program.schemaId.lastIndexOf(':');
      const lastVersion = program.schemaId.substring(n + 1);
      const lastVersionNr = Number(lastVersion.slice(0, -2));
      const versionNr = lastVersionNr + 1;
      const version = versionNr.toString() + '.0';
    } else {
      version = '1.0';
    }
    if (DEBUG) {
      const randomNumber = Math.floor(Math.random() * 1000) + 1;
      const randomDecimal = Math.floor(Math.random() * 10) + 1;
      version = randomNumber.toString() + '.' + randomDecimal.toString();
    }

    const schemaPost = {
      name: 'program_' + program.id.toString(),
      version: version, // + randomDecimal.toString(),
      attributes: attributes,
    };
    console.log(schemaPost);
    const api_string = API.schema;

    let responseSchema = await this.httpService
      .post(api_string, schemaPost)
      .toPromise();
    if (!responseSchema.data) {
      const errors = 'Schema not published';
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND);
    }
    const schemaId = responseSchema.data.schema_id;
    const credDefPost = {
      name: 'test1',
      schema_id: schemaId,
    };
    let responseCreddef = await this.httpService
      .post(API.credential.definition, credDefPost)
      .toPromise();
    if (!responseCreddef.data) {
      const errors = 'Cred def id not published';
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND);
    }
    const credDefId = responseCreddef.data.credential_definition_id;

    const result = {
      schemaId: schemaId,
      credDefId: credDefId,
    };
    return result;
  }
}
