import { DeepPartial, FilterQuery } from '@mikro-orm/core';
import { ObjectLiteral } from '../../types/object-literal';
import { BaseAggregate, DateValueObject, Id } from "../domain";

/**
 * Every entity that is persisted needs to have these props.
 */
export interface BaseOrmEntityProps {
  id: Id;
  createdAt: DateValueObject;
  updatedAt: DateValueObject;
}

/**
 * Entities can be filtered by the QueryParams.
 */
export type QueryParams<EntityProps> = DeepPartial<BaseOrmEntityProps & EntityProps>;

/**
 * The WhereCondition is used to filter the database entries.
 * The conditions must all be true in order to match.
 */
export type WhereCondition<OrmEntity> = FilterQuery<OrmEntity> | ObjectLiteral | string;

/**
 * The order direction to sort the entities by.
 */
export type OrderBy<EntityProps> = {
  /**
   * The key is the name of the field to order by.
   *
   * Use never so that typeorm does not complain.
   */
  [key in keyof EntityProps | keyof BaseOrmEntityProps | keyof never]?: OrderDir;
};

export enum OrderDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Metadata for retrieving paginated entries.
 */
export interface PaginationMeta {
  /**
   * This will skip the first x entries.
   * Also called offset.
   */
  skip?: number;
  /**
   * The maximum amount of entities to retrieve.
   */
  limit?: number;
  /**
   * The number of the page to retrieve.
   */
  page?: number;
}

/**
 * Parameter for retrieving paginated entities.
 */
export interface PaginatedParams<EntityProps> {
  /**
   * The query parameter to filter the entities.
   */
  params?: QueryParams<EntityProps>;
  /**
   * The metadata for pagination.
   */
  pagination?: PaginationMeta;
  /**
   * The order direction.
   */
  orderBy?: OrderBy<EntityProps>;
}

/**
 * The data that is returned from a pagination query.
 */
export interface DataWithPaginationMeta<T extends BaseOrmEntityProps[]> {
  /**
   * The returned entities.
   */
  data: T;
  /**
   * The amount of entities returned.
   */
  count: number;
  /**
   * The maximum amount of entries to retrieve.
   */
  limit?: number;
  /**
   * The number of the page.
   */
  page?: number;
}

/**
 * A generic repository interface.
 *
 * Specific interfaces should be defined in
 * a sub-interface in the respective module.
 */
export abstract class BaseRepositoryInterface<Entity extends BaseAggregate<unknown>, EntityProps> {
  /**
   * Creates or updates the given entity
   * @param entity
   */
  abstract saveOne(entity: Entity): Promise<Entity>;

  /**
   * Creates or updates all of the given entities.
   * @param entities
   */
  abstract saveMany(entities: Entity[]): Promise<Entity[]>;

  /**
   * Retrieves an object with the given id
   * @param params
   */
  abstract findOne(params: QueryParams<EntityProps>): Promise<Entity | undefined>;

  /**
   * Retrieves an object with the given id
   * @param params
   * @throws Error if the object does not exist
   */
  abstract findOneOrThrow(params: QueryParams<EntityProps>): Promise<Entity>;

  /**
   * Retrieves all entities that fit the given query parameters.
   * @param params
   */
  abstract findMany(params: QueryParams<EntityProps>): Promise<Entity[]>;

  /**
   * Retrieves the entities that fit the given query parameter with pagination.
   * @param params
   */
  abstract findManyPaginated(params: PaginatedParams<EntityProps>): Promise<DataWithPaginationMeta<Entity[]>>;

  /**
   * Deletes the given entity
   * @param entity
   */
  abstract deleteOne(entity: Entity): Promise<Entity>;
}
