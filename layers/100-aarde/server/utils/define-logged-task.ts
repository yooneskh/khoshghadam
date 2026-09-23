

export function defineLoggedTask(definition: Parameters<typeof defineTask>[0]) {
  return defineTask({
    meta: definition.meta,
    async run(event) {

      const startedAt = performance.now();


      try {
        return await definition.run(event);
      }
      finally {
        writeLog({
          taskName: definition.meta?.name ?? 'unknown',
          payload: event.payload,
          elapsed: performance.now() - startedAt,
        });
      }

    },
  });
}
