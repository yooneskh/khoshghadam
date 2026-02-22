import type { H3Event } from 'h3';
import { UnifiedResourceController } from './create-unified-resource-controller';


interface IUnifiedRouteHandlerArgs {
  event: H3Event;
  controller: UnifiedResourceController<any>;
}

export async function handleUnifiedSchemaRoute(args: IUnifiedRouteHandlerArgs) {
  return args.controller.schema();
}

export async function handleUnifiedListRoute(args: IUnifiedRouteHandlerArgs) {
  return args.controller.list({
    filter: {},
    sort: {},
    skip: 0,
    limit: 10,
  });
}

export async function handleUnifiedRetrieveRoute(args: IUnifiedRouteHandlerArgs) {
  return args.controller.retrieve({
    resourceId: getRouterParam(args.event, 'resourceId'),
  });
}

export async function handleUnifiedCreateRoute(args: IUnifiedRouteHandlerArgs) {
  return args.controller.create({
    document: await readBody(args.event),
  });
}

export async function handleUnifiedUpdateRoute(args: IUnifiedRouteHandlerArgs) {
  return args.controller.update({
    resourceId: getRouterParam(args.event, 'resourceId'),
    document: await readBody(args.event),
  });
}

export async function handleUnifiedDeleteRoute(args: IUnifiedRouteHandlerArgs) {
  return args.controller.delete({
    resourceId: getRouterParam(args.event, 'resourceId'),
  });
}
