import {
  BaseOrmEntity,
  BaseOrmMapper, DomainEventService,
  EntityProps, Id,
  MikroOrmBaseRepository, Nanoid, OrmEntityProps
} from "../../../src";
import { TestAggregate, TestAggregateProps } from './test.aggregate'
import { MikroORM } from "@mikro-orm/core";
import { nanoid } from "nanoid";

class TestOrmEntity extends BaseOrmEntity {
  id: string = nanoid(15);
  name: string;
}

class TestMapper extends BaseOrmMapper<TestAggregate, TestOrmEntity> {
  protected toDomainProps(ormEntity: TestOrmEntity): EntityProps<TestAggregateProps> {
    return {
      id: new Nanoid(ormEntity.id),
      props: {
        name: ormEntity.name,
      },
    };
  }

  protected toOrmProps(entity: TestAggregate): OrmEntityProps<TestOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      name: props.name,
    };
  }
}

class TestRepository extends MikroOrmBaseRepository<TestAggregate, TestAggregateProps, TestOrmEntity> {
  constructor(private readonly mikroORM: MikroORM, readonly eventService: DomainEventService) {
    super(mikroORM, TestOrmEntity, new TestMapper(TestAggregate, TestOrmEntity), eventService);
  }
}

export {
  TestAggregate,
  TestOrmEntity,
  TestRepository,
  TestAggregateProps,
  TestMapper,
}
