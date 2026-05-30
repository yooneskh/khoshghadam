import type { H3Event } from 'h3';
import { UnifiedResourceController } from './create-unified-resource-controller';


interface ResourceHandlerArgs {
  resource: string;
  event: H3Event;
  permission?: string;
}


export async function handleResourceSchema(args: ResourceHandlerArgs) {

  await ensureUserPermission(args);

  return (args.event.context[args.resource].dbo as UnifiedResourceController<any>).schema();

}


export async function handleResourceList(args: ResourceHandlerArgs) {

  await ensureUserPermission(args);

  if (getQuery(args.event)?.single === 'xtruex') {
    return (args.event.context[args.resource].dbo as UnifiedResourceController<any>).find({
      filter: extractFilterFromEvent(args.event),
      populate: extractPopulateFromEvent(args.event),
    });
  }
  else {
    return (args.event.context[args.resource].dbo as UnifiedResourceController<any>).list({
      filter: extractFilterFromEvent(args.event),
      sort: extractSortFromEvent(args.event),
      skip: Number(getQuery(args.event)?.skip ?? 0) || 0,
      limit: Number(getQuery(args.event)?.limit ?? 50) || 50,
      populate: extractPopulateFromEvent(args.event),
    });
  }

}

export async function handleResourceCount(args: ResourceHandlerArgs) {

  await ensureUserPermission(args);

  return (args.event.context[args.resource].dbo as UnifiedResourceController<any>).count({
    filter: extractFilterFromEvent(args.event),
  });

}

export async function handleResourceRetrieve(args: ResourceHandlerArgs) {

  await ensureUserPermission(args);

  return (args.event.context[args.resource].dbo as UnifiedResourceController<any>).retrieve({
    resourceId: getRouterParam(args.event, 'resourceId'),
    populate: extractPopulateFromEvent(args.event),
  });

}

export async function handleResourceCreate(args: ResourceHandlerArgs) {

  await ensureUserPermission(args);

  return (args.event.context[args.resource].dbo as UnifiedResourceController<any>).create({
    document: await readBody(args.event),
  });

}

export async function handleResourceUpdate(args: ResourceHandlerArgs) {

  await ensureUserPermission(args);

  return (args.event.context[args.resource].dbo as UnifiedResourceController<any>).update({
    resourceId: getRouterParam(args.event, 'resourceId'),
    document: await readBody(args.event),
  });

}

export async function handleResourceDelete(args: ResourceHandlerArgs) {

  await ensureUserPermission(args);

  return (args.event.context[args.resource].dbo as UnifiedResourceController<any>).delete({
    resourceId: getRouterParam(args.event, 'resourceId'),
  });

}


function extractFilterFromEvent(event: H3Event) {

  const filter = getQuery(event)?.filter ?? '';

  if (!filter) {
    return undefined;
  }


  return (
    String(filter)
      .split(',')
      .map(it => it.split(':'))
      .reduce((acc, it) => {

        const key = it[0] as string;
        const operator = it[2] ? it[1] : 'is';
        const value = it[2] ?? it[1] as string;

        if (operator === 'is') {
          acc[key] = value;
        }
        else if (operator === 'eq') {
          acc[key] = { $eq: value };
        }
        else if (operator === 'ne') {
          acc[key] = { $ne: value };
        }
        else if (operator === 'gt') {
          acc[key] = { $gt: value };
        }
        else if (operator === 'gte') {
          acc[key] = { $gte: value };
        }
        else if (operator === 'lt') {
          acc[key] = { $lt: value };
        }
        else if (operator === 'lte') {
          acc[key] = { $lte: value };
        }
        else if (operator === 'in') {
          acc[key] = { $in: value };
        }
        else if (operator === 'nin') {
          acc[key] = { $nin: value };
        }
        else if (operator === 'like') {
          acc[key] = { $regex: value, $options: 'i' };
        }

        return acc;

      }, {} as Record<string, any>)
  );

}

function extractSortFromEvent(event: H3Event) {

  const sort = getQuery(event)?.sort ?? '';

  if (!sort) {
    return undefined;
  }


  return (
    String(sort)
      .split(',')
      .map(it => it.split(':'))
      .reduce((acc, it) => {

        const key = it[0] as string;
        const direction = it[1] === 'asc' ? 1 : -1;

        acc[key] = direction;

        return acc;

      }, {} as Record<string, 1 | -1>)
  );

}

function extractPopulateFromEvent(event: H3Event): Record<string, string[]> | undefined {

  const populate = getQuery(event)?.populate;

  if (!populate) {
    return undefined;
  }


  return Object.fromEntries(
    String(populate)
      .split(',')
      .map(it => it.split(':'))
      .map(([key, value]) => [key, (value || '').split(';')]),
  );

}


async function ensureUserPermission(args: ResourceHandlerArgs) {

  if (!args.permission) {
    return;
  }


  const user = await assertUser(args);

  if (!user || !user.permissions?.length) {
    throw createError({
      statusCode: 401,
      statusMessage: 'unauthorized',
    });
  }


  const hasPermission = user.permissions.some(it => matchUserPermit(it, args.permission!));

  if (!hasPermission) {
    throw createError({
      statusCode: 401,
      statusMessage: 'unauthorized',
    });
  }

}

function matchUserPermit(permit: string, permission: string) {
  if (!permit.includes('**')) {
    return permit === permission;
  }
  else {

    const starIndex = permit.indexOf('**');

    return permit.slice(0, starIndex) === permission.slice(0, starIndex);

  }
}
