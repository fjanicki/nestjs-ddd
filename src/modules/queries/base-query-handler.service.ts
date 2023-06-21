import { IQueryHandler } from '@nestjs/cqrs';
import { Result } from '@badrap/result';
import { BaseQuery } from './base.query';

export abstract class BaseQueryHandlerService implements IQueryHandler {
  /**
   * For consistency with a CommandHandlerBase and DomainEventHandler
   */
  abstract handle(query: BaseQuery): Promise<Result<unknown>>;

  execute(query: BaseQuery): Promise<Result<unknown>> {
    return this.handle(query);
  }
}
