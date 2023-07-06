import { SQSClient } from "@aws-sdk/client-sqs";
import { Controller, Inject, Injectable, Module } from "@nestjs/common";
import { ClientProxy, ClientsModule, MessagePattern } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { SqsClient } from "../../../src/infrastructure/microservices/sqs";

export const consumerUrl = "http://localhost:4566/000000000000/producer";
export const producerUrl = "http://localhost:4566/000000000000/consumer";
export const AWS_REGION = "us-east-1";
export const SQS_SERVICE = "SQS_SERVICE";
export const EVENT_NAME = "EVENT_NAME";
export const NON_EXISTING_EVENT_NAME = "NON_EXISTING_EVENT_NAME";


export const testSqs = new SQSClient({
  endpoint: "http://localhost:4566",
  region: AWS_REGION,
  credentials: {
    accessKeyId: "x",
    secretAccessKey: "x",
  },
});

@Injectable()
export class TestSqsService {
  constructor(
    @Inject(SQS_SERVICE)
    private readonly sqsClientProxy: ClientProxy,
  ) {
  }

  public receive<T = any>(data: T): Promise<T> {
    return Promise.resolve(data);
  }

  public emit(data: any): Promise<void> {
    const res = this.sqsClientProxy.emit<void, any>(EVENT_NAME, data);
    return firstValueFrom(res);
  }

  public send(data: any): Promise<any> {
    const res = this.sqsClientProxy.send<string, any>(EVENT_NAME, data);
    return firstValueFrom(res);
  }

  public error(data: any): Promise<any> {
    const res = this.sqsClientProxy.send<string, any>("NON_EXISTING_EVENT_NAME", data);
    return firstValueFrom(res);
  }
}

@Controller()
export class TestSqsController {
  constructor(private readonly sqsService: TestSqsService) {
  }

  @MessagePattern(EVENT_NAME)
  public receive<T = any>(data: T): Promise<T> {
    return this.sqsService.receive(data);
  }
}

@Module(
  {
    imports: [
      ClientsModule.register([
        {
          name: SQS_SERVICE,
          customClass: SqsClient,
          options: {
            consumerUrl: producerUrl,
            producerUrl: consumerUrl,
            sqs: testSqs,
          },
        },
      ]),
    ],
    controllers: [TestSqsController],
    providers: [TestSqsService],
  })
export class TestSqsModule {
}
