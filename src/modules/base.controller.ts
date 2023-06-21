import { BaseResponse } from './base.response';

/**
 * A controller handles an incoming http request.
 *
 * The subclasses have to be annotated with @Controller()
 */
export abstract class BaseController {
  /**
   * Handle handles the incoming http request
   * @param params The required parameters. E.g. the @Req
   */
  abstract handle(...params: unknown[]): Promise<BaseResponse>;
}
