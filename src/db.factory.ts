import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Provider } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

export const dbFactory: Provider = {
  provide: DynamoDBClient,
  useFactory: (configService: ConfigService): DynamoDBClient => {
    const dbParams = {
      endpoint: configService.get<string>('AWS_ENDPOINT', null),
      region: configService.get<string>('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        sessionToken: configService.get<string>('AWS_SESSION_TOKEN'),
      },
    };

    return new DynamoDBClient(dbParams);
  },
  inject: [ConfigService],
};
