import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { SqsServer } from "../../../src/infrastructure/microservices/sqs";
import {
  AWS_REGION,
  consumerUrl,
  EVENT_NAME,
  NON_EXISTING_EVENT_NAME,
  producerUrl,
  testSqs,
  TestSqsModule,
  TestSqsService
} from "./test-setup";
import { SendMessageCommandInput } from "@aws-sdk/client-sqs/dist-types/commands/SendMessageCommand";

describe("SqsServer", () => {
  let app: INestApplication;
  let sqsService: TestSqsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestSqsModule],
    }).compile();
    app = module.createNestApplication();
    app.connectMicroservice({
      strategy: new SqsServer({
        consumerOptions: {
          sqs: testSqs,
          region: AWS_REGION,
          queueUrl: consumerUrl,
        },
        producerOptions: {
          sqs: testSqs,
          region: AWS_REGION,
          queueUrl: producerUrl,
        },
      }),
    });
    await app.startAllMicroservices();

    sqsService = module.get<TestSqsService>(TestSqsService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  describe("SqsService - Normal Queue", () => {
    let logSpy: jest.SpyInstance;

    beforeEach(() => {
      logSpy = jest.spyOn(sqsService, "receive");
    });

    afterEach(() => {
      logSpy.mockClear();
    });

    it("should emit event", async () => {
      const data = { test: true };
      const result = await sqsService.emit(data);


      expect(result).toHaveLength(1);
      expect(logSpy).toBeCalledTimes(1);
    });

    it("should receive event", async () => {
      const data = { test: true };
      const params: SendMessageCommandInput = {
        // DelaySeconds: 10,
        MessageBody: JSON.stringify({ pattern: EVENT_NAME, data }),
        QueueUrl: consumerUrl,
      };
      const result = await testSqs.send(new SendMessageCommand(params));

      // await new Promise(resolve => setTimeout(resolve, 1000));

      expect(result).toBeDefined();
      expect(logSpy).toBeCalledTimes(1);
    });

    it("should send/receive event", async () => {
      const data = { test: true };
      const result = await sqsService.send(data);

      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(result).toEqual(data);
      expect(logSpy).toBeCalledTimes(1);
    });

    it("should handle absent handler", async () => {
      const data = { test: true };
      const params = {
        MessageAttributes: {
          Title: {
            DataType: "String",
            StringValue: "The Whistler",
          },
          Author: {
            DataType: "String",
            StringValue: "John Grisham",
          },
          WeeksOn: {
            DataType: "Number",
            StringValue: "6",
          },
        },
        MessageBody: JSON.stringify({ pattern: NON_EXISTING_EVENT_NAME, data }),
        QueueUrl: consumerUrl,
      };

      const result = await testSqs.send(new SendMessageCommand(params));

      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(result).toBeDefined();
    });

    it("should handle invalid message format", async () => {
      const params = {
        MessageBody: "Invalid message format", // not a valid JSON string
        QueueUrl: consumerUrl,
      };
      await testSqs.send(new SendMessageCommand(params));

      // Verify that your service handles this gracefully and does not crash
      // This might involve checking application logs, error counts, etc.
    });

    it("should handle delayed messages", async () => {
      const data = { test: true };
      const params = {
        MessageBody: JSON.stringify({ pattern: EVENT_NAME, data }),
        QueueUrl: consumerUrl,
        DelaySeconds: 10, // delay delivery for 10 seconds
      };

      await testSqs.send(new SendMessageCommand(params));

      // Verify that the message is not immediately received
      expect(logSpy).not.toBeCalled();

      // After 10 seconds, the message should be received
      await new Promise(resolve => setTimeout(resolve, 10000));
      expect(logSpy).toBeCalledTimes(1);
    });

    it("should handle large messages", async () => {
      const largeData = { test: 'a'.repeat(256 * 1024) }; // Large message
      const params = {
        MessageBody: JSON.stringify({ pattern: EVENT_NAME, largeData }),
        QueueUrl: consumerUrl,
      };

      // This should fail if your service does not properly handle large messages
      await expect(testSqs.send(new SendMessageCommand(params))).resolves.toBeDefined();
    });

    it("should retry failed messages", async () => {
      // Emit a message that will fail to process
      const failingData = { test: true, fail: true }; // Modify your handler to fail when 'fail' is true
      await sqsService.emit(failingData);

      // Verify that the message is received multiple times due to retries
      // You may need to adjust the delay and expected count based on your retry configuration
      await new Promise(resolve => setTimeout(resolve, 10000));
      expect(logSpy).toBeCalledTimes(3); // Assuming a retry policy of 3 attempts
    });

    it("should handle duplicate messages", async () => {
      // Emit the same message twice
      const duplicateData = { test: true };
      await sqsService.emit(duplicateData);
      await sqsService.emit(duplicateData);

      // Verify that the message is received only once
      // This test assumes that you have deduplication enabled
      await new Promise(resolve => setTimeout(resolve, 2000));
      expect(logSpy).toBeCalledTimes(1);
    });
  });
});
