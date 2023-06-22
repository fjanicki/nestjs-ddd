import { DateTimeType, Property } from '@mikro-orm/core';

/**
 * The entity that is persisted.
 */
export abstract class BaseOrmEntity {
  /**
   * The concrete type of id has to be defined in a sub-class.
   */
  id!: string;

  @Property({ type: DateTimeType })
  createdAt: string = new Date().toISOString();

  @Property({ type: DateTimeType, onUpdate: () => new Date().toISOString() })
  updatedAt: string = new Date().toISOString();

  constructor(props?: unknown) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
