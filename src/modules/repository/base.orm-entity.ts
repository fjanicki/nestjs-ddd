import { Property } from '@mikro-orm/core';

/**
 * The entity that is persisted.
 */
export abstract class BaseOrmEntity {
  /**
   * The concrete type of id has to be defined in a sub-class.
   */
  id!: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  constructor(props?: unknown) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
