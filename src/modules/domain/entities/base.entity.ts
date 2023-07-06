import { Id } from '../value-object';
import { DateValueObject } from '../value-object';
import { ConvertUtils, ValidateUtils } from '../../../utils';
import { ArgumentNotProvidedError, ArgumentOutOfRangeError } from '../../../errors';

export interface BaseEntityProps {
  id: Id;
  createdAt?: DateValueObject;
  updatedAt?: DateValueObject;
}

export interface CreateEntityProps<T> {
  id: Id;
  props: T;
  createdAt?: DateValueObject;
  updatedAt?: DateValueObject;
}

/**
 * An entity is a uniquely identifiable resource in the system.
 */
export abstract class BaseEntity<EntityProps> {
  /**
   * The unique id of the entity.
   */
  protected abstract _id: Id;
  /**
   * The date when the entity was last updated.
   */
  private readonly _updatedAt: DateValueObject;
  /**
   * The date when the entity was created.
   */
  private readonly _createdAt: DateValueObject;
  /**
   * The attributes of the entity type.
   *
   * The props can be accessed using getters and setters.
   *
   * E.g. a user has a name and an email address.
   * @protected
   */
  protected readonly props: EntityProps;

  constructor({ id, createdAt, updatedAt, props }: CreateEntityProps<EntityProps>) {
    this.setId(id);
    this.validateProps(props);
    const now = DateValueObject.now();
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this.props = props;
    this.validate();
  }

  get id(): Id {
    return this._id;
  }

  private setId(id: Id): void {
    this._id = id;
  }

  get createdAt(): DateValueObject {
    return this._createdAt;
  }

  get updatedAt(): DateValueObject {
    return this._updatedAt;
  }

  /**
   * Validates that the props are valid.
   * @throws Error When the props are invalid
   */
  public abstract validate(): void;

  /**
   * Returns the current copy of the entity's props.
   * Modifying the entity's state won't change any previously created
   * copy returned by this method, since it doesn't return a reference.
   *
   * If a reference to a specific property is needed, create a getter in
   * the parent class.
   */
  public getPropsCopy(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  /**
   * Convert an Entity and all sub-entities/Value Objects it
   * contains to a plain object with primitive types. Can be
   * useful when logging an entity during testing/debugging
   */
  public toObject(): unknown {
    const plainProps = ConvertUtils.convertPropsToObject(this.props);

    const result = {
      id: this._id.value,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
      ...plainProps,
    };
    return Object.freeze(result);
  }

  private validateProps(props: EntityProps): void {
    const maxProps = 50;

    if (ValidateUtils.isEmpty(props)) {
      throw new ArgumentNotProvidedError('Entity props should not be empty');
    }
    if (typeof props !== 'object') {
      throw new ArgumentNotProvidedError('Entity props should be an object');
    }
    if (Object.keys(props).length > maxProps) {
      throw new ArgumentOutOfRangeError(`Entity props should not have more than ${maxProps} properties`);
    }
  }
}
