import { type } from 'arktype';
import { createError, type H3Event, readBody } from 'h3';


export function assertBody<const def>(args: { event: H3Event, schema: type.validate<def> }): Promise<type.infer.Out<def>>;
export async function assertBody(args: { event: H3Event, schema: unknown }): Promise<unknown> {

  const body = await readBody(args.event, { strict: true });
  const arktypeSchema = type.raw(args.schema);
  const validatedBody = arktypeSchema(body);

  if (validatedBody instanceof type.errors) {
    throw createError({
      statusCode: 400,
      statusMessage: 'request body is invalid',
      data: {
        errors: validatedBody.summary,
      },
    });
  }


  return validatedBody;

}
