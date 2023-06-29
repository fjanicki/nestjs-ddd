import { Logger } from "@nestjs/common";
import { ClientProxy, PacketId, ReadPacket, WritePacket } from "@nestjs/microservices";
import { Producer } from "sqs-producer";
import { Consumer } from "sqs-consumer";
import { Message } from "@aws-sdk/client-sqs";

import { SqsClientOptions } from "./interfaces";
import { SqsDeserializer } from "./sqs.deserializer";
import { SqsSerializer } from "./sqs.serializer";
import { Nanoid } from "../../../modules/domain";

export class SqsClient extends ClientProxy {
  private producer: Producer;
  private consumer: Consumer;

  private readonly logger = new Logger("SqsService");

  constructor(protected readonly options: SqsClientOptions["options"]) {
    super();

    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  public createClient(): void {
    const { producerUrl, consumerUrl, ...options } = this.options;
    this.consumer = Consumer.create({
      sqs: options.sqs,
      queueUrl: consumerUrl,
      handleMessage: this.handleMessage.bind(this),
    });

    this.consumer.on("error", err => {
      this.logger.error(err.message);
    });

    this.consumer.on("processing_error", err => {
      this.logger.error(err.message);
    });

    this.consumer.on("timeout_error", err => {
      this.logger.error(err.message);
    });

    this.consumer.start();

    this.producer = Producer.create({
      ...options,
      queueUrl: producerUrl,
    });
  }

  protected publish(partialPacket: ReadPacket, callback: (packet: WritePacket) => any): () => void {
    const packet = this.assignPacketId(partialPacket);
    const serializedPacket = this.serializer.serialize(packet);

    void this.producer.send(serializedPacket).then(() => {
      this.routingMap.set(packet.id, callback);
    });
    return () => this.routingMap.delete(packet.id);
  }

  protected dispatchEvent(packet: ReadPacket): Promise<any> {
    const serializedPacket = this.serializer.serialize(packet);
    return this.producer.send(serializedPacket);
  }

  public connect(): Promise<any> {
    if (!this.producer) {
      this.createClient();
    }
    return Promise.resolve();
  }

  public async handleMessage(message: Message): Promise<void> {
    const { id, response, err, status, isDisposed } = await this.deserializer.deserialize(message);
    const callback = this.routingMap.get(id);

    if (!callback) {
      return undefined;
    }
    callback({
      response,
      err,
      status,
      isDisposed,
    });
  }

  public close(): void {
    if (this.consumer) {
      this.consumer.stop();
    }
  }

  protected assignPacketId(packet: ReadPacket): ReadPacket & PacketId {
    const id = Nanoid.generate().value;
    return Object.assign(packet, { id });
  }

  protected initializeSerializer(options: SqsClientOptions["options"]): void {
    this.serializer = options?.serializer ?? new SqsSerializer();
  }

  protected initializeDeserializer(options: SqsClientOptions["options"]): void {
    this.deserializer = options?.deserializer ?? new SqsDeserializer();
  }
}
