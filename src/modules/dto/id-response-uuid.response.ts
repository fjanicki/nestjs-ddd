import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../base.response';

export class IdResponse extends BaseResponse {
  @ApiProperty({
    description: 'The id of the created entity',
    type: String,
    example: '9a92b1e0-c565-4ab2-8f97-f72d4b98734b',
  })
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}
