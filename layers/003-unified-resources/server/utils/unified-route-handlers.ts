
/* responsibility */

// Implements standard REST handlers
// for unified resources.


interface ResourceHandlerArgs {
  resource: string;
  event: H3Event;
  permission?: string;
}


/* resource */

function resourceController(resource: string) {
  return (app[resource as keyof typeof app] as { dbo?: UnifiedResourceController<any>; } | undefined)?.dbo;
}

async function assertOptionalPermission(args: ResourceHandlerArgs) {
  if (args.permission) {
    await assertUserPermission({
      event: args.event,
      permission: args.permission,
    });
  }
}

export async function handleResourceSchema(args: ResourceHandlerArgs) {

  await assertOptionalPermission(args);


  return resourceController(args.resource)?.schema();

}


export async function handleResourceList(args: ResourceHandlerArgs) {

  await assertOptionalPermission(args);


  if (getQuery(args.event)?.single === 'true') {
    return resourceController(args.resource)?.find({
      filter: extractFilterFromEvent(args.event),
      select: extractSelectFromEvent(args.event),
      populate: extractPopulateFromEvent(args.event),
    });
  }
  else {
    return resourceController(args.resource)?.list({
      filter: extractFilterFromEvent(args.event),
      select: extractSelectFromEvent(args.event),
      sort: extractSortFromEvent(args.event),
      skip: Math.max(0, Math.trunc(Number(getQuery(args.event)?.skip ?? 0)) || 0),
      limit: Math.min(300, Math.max(0, Math.trunc(Number(getQuery(args.event)?.limit ?? 300)) || 300)),
      populate: extractPopulateFromEvent(args.event),
    });
  }

}


export async function handleResourceCount(args: ResourceHandlerArgs) {

  await assertOptionalPermission(args);


  return resourceController(args.resource)?.count({
    filter: extractFilterFromEvent(args.event),
  });

}


export async function handleResourceRetrieve(args: ResourceHandlerArgs) {

  await assertOptionalPermission(args);


  return resourceController(args.resource)?.retrieve({
    resourceId: getRouterParam(args.event, 'resourceId'),
    populate: extractPopulateFromEvent(args.event),
  });

}


export async function handleResourceCreate(args: ResourceHandlerArgs) {

  await assertOptionalPermission(args);


  return resourceController(args.resource)?.create({
    document: await readBody(args.event),
  });

}


export async function handleResourceUpdate(args: ResourceHandlerArgs) {

  await assertOptionalPermission(args);


  return resourceController(args.resource)?.update({
    resourceId: getRouterParam(args.event, 'resourceId'),
    document: await readBody(args.event),
  });

}


export async function handleResourceDelete(args: ResourceHandlerArgs) {

  await assertOptionalPermission(args);


  return resourceController(args.resource)?.delete({
    resourceId: getRouterParam(args.event, 'resourceId'),
  });

}
