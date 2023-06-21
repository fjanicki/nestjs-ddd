import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityProps } from '../domain/entities/base.entity';
import { IdResponse } from './id-response-uuid.response';

export class BaseEntityResponse extends IdResponse {
  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  createdAt: string;
  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  updatedAt: string;

  constructor(entity: BaseEntityProps) {
    super(entity?.id.value);
    this.createdAt = entity?.createdAt.value.toISOString();
    this.updatedAt = entity?.updatedAt.value.toISOString();
  }
}
