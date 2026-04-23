import { type } from 'arktype';


export function parseSchema<const def>(schema: type.validate<def>) {
  return {
    schema,
    type: type.raw(schema),
    inferred: type.raw(schema) as type.infer.Out<def>,
  };
}

