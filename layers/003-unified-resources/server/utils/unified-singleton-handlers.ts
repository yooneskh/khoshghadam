
/* responsibility */

// Implements singleton route handlers
// for unified singleton resources.


/* singleton */

import { extractPopulateFromEvent, extractSelectFromEvent } from '../libs/extract-resource-query-from-event';


interface SingletonHandlerArgs {
  resource: string;
  event: H3Event;
  permission?: string;
}


function singletonController(resource: string) {
  return (app[resource as keyof typeof app] as { dbo?: UnifiedSingletonController<any>; } | undefined)?.dbo;
}

async function assertOptionalPermission(args: SingletonHandlerArgs) {
  if (args.permission) {
    await assertUserPermission({
      event: args.event,
      permission: args.permission,
    });
  }
}

export async function handleSingletonSchema(args: SingletonHandlerArgs) {
  await assertOptionalPermission(args);
  return singletonController(args.resource)?.schema();
}

export async function handleSingletonRetrieve(args: SingletonHandlerArgs) {

  await assertOptionalPermission(args);

  return singletonController(args.resource)?.retrieve({
    select: extractSelectFromEvent(args.event),
    populate: extractPopulateFromEvent(args.event),
  });

}

export async function handleSingletonUpdate(args: SingletonHandlerArgs) {

  await assertOptionalPermission(args);

  return singletonController(args.resource)?.update({
    document: await readBody(args.event),
  });

}
