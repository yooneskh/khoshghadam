/* responsibility */

// Returns the media settings singleton


export default defineEventHandler(async event => {
  return handleSingletonRetrieve({
    resource: 'mediaSettings',
    event,
  });
});
