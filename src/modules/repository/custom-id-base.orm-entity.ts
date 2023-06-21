import { Property } from '@mikro-orm/core';
import { BaseOrmEntity } from './base.orm-entity';

/**
 * Orm Entity with a custom id
 */
export abstract class CustomIdBaseOrmEntity extends BaseOrmEntity {
  @Property()
  id!: string;
}
