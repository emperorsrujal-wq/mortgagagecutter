'use client';

// This file serves as a central "barrel" for exporting Firebase-related hooks and providers.
// By re-exporting from other modules, we can avoid circular dependencies and keep the code organized.

// Export the core providers and initialization logic
export * from './provider';
export * from './client-provider';
export * from './initialize'; // This now contains the initializeFirebase function

// Export Firestore hooks
export * from './firestore/use-collection';
export * from './firestore/use-doc';

// Export Auth hooks
export * from './auth/use-user';

// Export utility/helper functions
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
