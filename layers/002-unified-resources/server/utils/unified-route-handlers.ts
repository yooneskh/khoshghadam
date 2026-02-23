import { UnifiedResourceController } from './create-unified-resource-controller';


interface IUnifiedRouteHandlerArgs {
  resource: string;
}


export function createResourceRouter(args: IUnifiedRouteHandlerArgs) {

  const router = createRouter();


  router.get('/schema', defineEventHandler(async event => {
    return (event.context[args.resource] as UnifiedResourceController<any>).schema();
  }));

  router.get('/', defineEventHandler(async event => {
    return (event.context[args.resource] as UnifiedResourceController<any>).list({
      filter: {},
      sort: {},
      skip: 0,
      limit: 10,
    });
  }));

  router.get('/:resourceId', defineEventHandler(async event => {
    return (event.context[args.resource] as UnifiedResourceController<any>).retrieve({
      resourceId: getRouterParam(event, 'resourceId'),
    });
  }));
  
  router.post('/', defineEventHandler(async event => {
    return (event.context[args.resource] as UnifiedResourceController<any>).create({
      document: await readBody(event),
    });
  }));
  
  router.patch('/:resourceId', defineEventHandler(async event => {
    return (event.context[args.resource] as UnifiedResourceController<any>).update({
      resourceId: getRouterParam(event, 'resourceId'),
      document: await readBody(event),
    });
  }));

  router.delete('/:resourceId', defineEventHandler(async event => {
    return (event.context[args.resource] as UnifiedResourceController<any>).delete({
      resourceId: getRouterParam(event, 'resourceId'),
    });
  }));


  return defineLazyEventHandler(() => router.handler);

}
