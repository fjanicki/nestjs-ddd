import { BaseAggregate, Id, Nanoid, Uuid } from "../../../src";

type TestAggregateProps = {
  name: string
};

class TestAggregate extends BaseAggregate<TestAggregateProps> {
  protected _id: Nanoid;

  validate(): void {
  }

  get name(): string {
    return this.props.name;
  }
}

export {
  TestAggregate,
  TestAggregateProps
}
