import type { H3Event } from 'h3';
import { UnifiedResourceController } from './create-unified-resource-controller';


interface ResourceHandlerArgs {
  resource: string;
  event: H3Event;
}


export function handleResourceSchema(args: ResourceHandlerArgs) {
  return (args.event.context[args.resource] as UnifiedResourceController<any>).schema();
}


export function handleResourceList(args: ResourceHandlerArgs) {
  return (args.event.context[args.resource] as UnifiedResourceController<any>).list({
    filter: extractFilterFromEvent(args.event),
    sort: extractSortFromEvent(args.event),
    skip: Number(getQuery(args.event)?.skip ?? 0) ?? 0,
    limit: Number(getQuery(args.event)?.limit ?? 50) ?? 50,
  });
}

export function handleResourceRetrieve(args: ResourceHandlerArgs) {
  return (args.event.context[args.resource] as UnifiedResourceController<any>).retrieve({
    resourceId: getRouterParam(args.event, 'resourceId'),
  });
}

export async function handleResourceCreate(args: ResourceHandlerArgs) {
  return (args.event.context[args.resource] as UnifiedResourceController<any>).create({
    document: await readBody(args.event),
  });
}

export async function handleResourceUpdate(args: ResourceHandlerArgs) {
  return (args.event.context[args.resource] as UnifiedResourceController<any>).update({
    resourceId: getRouterParam(args.event, 'resourceId'),
    document: await readBody(args.event),
  });
}

export function handleResourceDelete(args: ResourceHandlerArgs) {
  return (args.event.context[args.resource] as UnifiedResourceController<any>).delete({
    resourceId: getRouterParam(args.event, 'resourceId'),
  });
}


function extractFilterFromEvent(event: H3Event) {
  return (
    String(getQuery(event)?.filter ?? '')
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
  return (
    String(getQuery(event)?.sort ?? '')
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
