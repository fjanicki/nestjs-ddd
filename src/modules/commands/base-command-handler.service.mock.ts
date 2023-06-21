import { BaseCommandHandlerService } from './base-command-handler.service';
import { BaseCommand } from './base.command';
import { Result } from '@badrap/result';

/**
 * The ServiceMock mocks a service for testing.
 *
 * The mock receives parameters that are returned by the
 * do function in its constructor.
 * The mock should store the parameters it receives
 * in the do function.
 */
export class BaseCommandHandlerServiceMock<R, P extends BaseCommand> extends BaseCommandHandlerService {
  /**
   * The command that is passed to the service.
   * Save it to test for expected values.
   */
  command: P;

  /**
   * The constructor gets passed the value that the mock should
   * return.
   * @param mockValue The value to return in the do() function.
   * @protected
   */
  constructor(readonly mockValue: R) {
    super();
  }

  async handle(command?: P): Promise<Result<unknown>> {
    this.command = command;
    return Result.ok(this.mockValue);
  }
}
