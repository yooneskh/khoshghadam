import { type, Type } from 'arktype';


export function parseSchema<const def>(schema: type.validate<def>) {

  const compiled = type.raw(schema);

  return {
    schema,
    type: compiled as Type<type.infer.Out<def>>,
    inferred: compiled as type.infer.Out<def>,
  };

}
