import { Type } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { ProducerOptions } from "./producer";

export interface SqsClientOptions {
  customClass: Type<ClientProxy>;
  options: ProducerOptions;
}
