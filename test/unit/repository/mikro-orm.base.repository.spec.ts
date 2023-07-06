import { MikroORM } from '@mikro-orm/core';
import {
  DomainEventService,
  MikroOrmBaseRepository, Nanoid
} from "../../../src";
import { TestAggregate, TestOrmEntity, TestRepository } from "../fixtures/test.orm";

describe('MikroOrmBaseRepository', () => {
  let repo: TestRepository;
  let orm: MikroORM;
  let eventService: DomainEventService;

  beforeEach(async () => {
    orm = ({
      em: {
        persistAndFlush: jest.fn(),
        findOne: jest.fn(),
      },
    } as unknown) as MikroORM;
    eventService = {
      publishEvents: jest.fn(),
      eventEmitter: jest.fn() // Add this line
    } as unknown as DomainEventService;

    repo = new TestRepository(
      orm,
      eventService,
    );
  });

  it('should save an entity', async () => {
    const entity = new TestAggregate({
      id: Nanoid.generate(),
      props: {
        name: 'test',
      }
    });
    await repo.saveOne(entity);

    expect(orm.em.persistAndFlush).toBeCalledWith(expect.any(TestOrmEntity));
    expect(eventService.publishEvents).toBeCalledWith(entity.id);
  });

  it('should find an entity', async () => {
    const entity = new TestAggregate({
      id: Nanoid.generate(),
      props: {
        name: 'test',
      }
    });
    (orm.em.findOne as jest.Mock).mockResolvedValue(entity);

    const found = await repo.findOne({
      id: entity.id, createdAt: undefined, updatedAt: undefined, name: 'test'
    });

    expect(orm.em.findOne).toBeCalledWith(TestOrmEntity, expect.anything());
    expect(found).toEqual(entity);
  });
});
