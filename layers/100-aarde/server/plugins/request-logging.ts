

export default defineNitroPlugin(nitroApp => {

  nitroApp.hooks.hook('request', event => {
    event.context.startedAt = performance.now();
  });


  nitroApp.hooks.hook('afterResponse', (event, response) => {

    const startedAt = event.context.startedAt ?? performance.now();
    const elapsed = performance.now() - startedAt;


    if (event.path.startsWith('/api')) {
      writeLog({
        method: event.method,
        path: event.path,
        requestSize: Number(getRequestHeader(event, 'content-length')),
        status: getResponseStatus(event),
        responseSize: resolveResponseSize(event, response?.body),
        elapsed,
      });
    }
    else {
      writeLog({
        method: event.method,
        path: event.path,
        status: getResponseStatus(event),
        responseSize: resolveResponseSize(event, response?.body),
        elapsed,
      });
    }

  });

});


function resolveResponseSize(event: H3Event, body: unknown): number | string {

  const contentLength = getResponseHeader(event, 'content-length');


  if (contentLength) {
    return Number(contentLength);
  }
  else if (body === null || body === undefined) {
    return 0;
  }
  else if (typeof body === 'string') {
    return Buffer.byteLength(body);
  }
  else if (body instanceof Uint8Array || body instanceof ArrayBuffer) {
    return body.byteLength;
  }
  else if (body instanceof Response || body instanceof ReadableStream) {
    return '-';
  }
  else if (typeof body === 'object') {
    try {
      return Buffer.byteLength(JSON.stringify(body));
    }
    catch {
      return '-';
    }
  }
  else {
    return '-';
  }

}
