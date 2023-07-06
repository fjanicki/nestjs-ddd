import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEventService, Nanoid, Uuid } from "../../../src";
import { TestDomainEvent } from "./test.domain-event";
import { TestAggregate } from "../fixtures/test.aggregate";

describe('DomainEventService', () => {
  let service: DomainEventService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainEventService,
        {
          provide: EventEmitter2,
          useValue: {emit: jest.fn()},
        },
      ],
    }).compile();

    service = module.get<DomainEventService>(DomainEventService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('prepareForPublish', () => {
    it('should add an aggregate to aggregates array', () => {
      const id = Uuid.generate();
      const aggregate = new TestAggregate({id, props: {name: 'test'}});

      DomainEventService.prepareForPublish(aggregate);
      expect(DomainEventService['aggregates']).toContain(aggregate);
    });
  });

  describe('publishEvents with UUID as an ID', () => {
    it('should publish events from the aggregate', async () => {
      const id = Uuid.generate();
      const aggregate = new TestAggregate({id, props: {name: 'test'}});
      const domainEvent = new TestDomainEvent({aggregateId: aggregate.id});
      aggregate.addEvent(domainEvent);
      DomainEventService.prepareForPublish(aggregate);

      await service.publishEvents(id, 'correlation123');

      expect(eventEmitter.emit).toHaveBeenCalledWith('TestDomainEvent', domainEvent);
    });
  });

  describe('publishEvents with Nanoid as an ID', () => {
    it('should publish events from the aggregate', async () => {
      const id = Nanoid.generate();
      const aggregate = new TestAggregate({id, props: {name: 'test'}});
      const domainEvent = new TestDomainEvent({aggregateId: aggregate.id});
      aggregate.addEvent(domainEvent);
      DomainEventService.prepareForPublish(aggregate);

      await service.publishEvents(id, 'correlation123');

      expect(eventEmitter.emit).toHaveBeenCalledWith('TestDomainEvent', domainEvent);
    });
  });
});
