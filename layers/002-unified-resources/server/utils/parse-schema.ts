import { type, Type } from 'arktype';


export function parseSchema<const def>(schema: type.validate<def>) {
  return {
    schema,
    type: type.raw(schema) as Type<type.infer.Out<def>>,
    inferred: type.raw(schema) as type.infer.Out<def>,
  };
}
