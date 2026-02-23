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
    filter: {},
    sort: {},
    skip: 0,
    limit: 10,
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
