import { MikroORM, FilterQuery, QueryOrderMap, Constructor } from '@mikro-orm/core';
import { Logger, NotFoundException } from '@nestjs/common';
import { BaseAggregate } from "../domain";
import {
  BaseRepositoryInterface,
  DataWithPaginationMeta, OrderBy,
  PaginatedParams,
  QueryParams
} from "./base.repository.interface";
import { BaseOrmMapper } from "./base.orm-mapper";
import { DomainEventService } from "../commands/publish-domain-events";

export abstract class MikroOrmBaseRepository<
  Entity extends BaseAggregate<unknown>,
  EntityProps,
  OrmEntity extends object,
> implements BaseRepositoryInterface<Entity, EntityProps>
{
  protected readonly logger = new Logger(this.constructor.name);

  protected constructor(
    protected readonly orm: MikroORM,
    protected readonly entityClass: Constructor<OrmEntity>,
    protected readonly mapper: BaseOrmMapper<Entity, OrmEntity>,
    protected readonly eventService: DomainEventService,
  ) {}

  async saveOne(entity: Entity): Promise<Entity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    await this.orm.em.persistAndFlush(ormEntity);
    this.logger.debug(`[Entity persisted]: ${entity.id.value}`);
    await this.eventService.publishEvents(entity.id);
    return this.mapper.toDomainEntity(ormEntity);
  }

  async saveMany(entities: Entity[]): Promise<Entity[]> {
    const ormEntities = entities.map((entity) => this.mapper.toOrmEntity(entity));
    await this.orm.em.persistAndFlush(ormEntities);
    this.logger.debug(`[Multiple entities persisted]: ${entities.length}`);
    await Promise.all(entities.map(async (entity) => await this.eventService.publishEvents(entity.id)));
    return ormEntities.map((entity) => this.mapper.toDomainEntity(entity));
  }

  async findOne(params: QueryParams<EntityProps>): Promise<Entity | undefined> {
    const found = await this.orm.em.findOne(this.entityClass, this.preparePropsQuery(params));
    return found ? this.mapper.toDomainEntity(found) : undefined;
  }

  async findOneOrThrow(params: QueryParams<EntityProps>): Promise<Entity> {
    const found = await this.findOne(params);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async findMany(params: QueryParams<EntityProps>): Promise<Entity[]> {
    const result = await this.orm.em.find(this.entityClass, this.preparePropsQuery(params), {});
    return result.map((item) => this.mapper.toDomainEntity(item));
  }

  async findManyPaginated({
    params,
    pagination,
    orderBy,
  }: PaginatedParams<EntityProps>): Promise<DataWithPaginationMeta<Entity[]>> {
    const [data, count] = await this.orm.em.findAndCount(this.entityClass, this.preparePropsQuery(params), {
      limit: pagination?.limit,
      offset: pagination?.skip,
      orderBy: this.prepareOrderQuery(orderBy),
    });

    return {
      data: (data as unknown as OrmEntity[]).map((item) => this.mapper.toDomainEntity(item)),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };
  }

  async deleteOne(entity: Entity): Promise<Entity> {
    await this.orm.em.removeAndFlush(this.mapper.toOrmEntity(entity));
    this.logger.debug(`[Entity deleted]: ${entity.id.value}`);
    return entity;
  }

  protected preparePropsQuery(params: QueryParams<EntityProps>): FilterQuery<OrmEntity> {
    // Override this in your subclass to prepare query from params.
    return params as FilterQuery<OrmEntity>;
  }

  protected prepareOrderQuery(orderBy?: OrderBy<EntityProps>): QueryOrderMap<unknown> | undefined {
    // Override this in your subclass to prepare order query.
    return orderBy as QueryOrderMap<unknown>;
  }
}
