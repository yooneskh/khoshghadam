
/* responsibility */

// Holds the global typed registry
// that resource plugins fill with their controllers.


declare global {
  interface UnifiedAppRegistry {}
};


export const app = Object.create(null) as UnifiedAppRegistry;
