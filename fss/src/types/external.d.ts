/**
 * External library type declarations
 *
 * Type definitions for third-party libraries that don't have
 * their own type definitions or need custom declarations.
 */

/**
 * superagent type declaration
 * Note: @types/superagent is installed and provides proper types
 * This module declaration is kept for potential future extensions
 */

/**
 * querystring-es3 type declaration
 * This library is a polyfill for Node.js querystring module
 */
declare module 'querystring-es3' {
  export function parse(str: string): Record<string, string | string[]>;
  export function stringify(obj: Record<string, string | string[] | number | boolean | null | undefined>): string;
}

/**
 * Global variables injected by Vite at build time
 * This contains the JSON configuration for FSS (Fess Site Search)
 */
declare const __FSS_JSON_CONFIG__: Record<string, string | number | boolean | null | undefined | Record<string, unknown>>;

/**
 * Google Analytics global function
 * Legacy ga() function from Google Universal Analytics
 */
declare function ga(
  command: string,
  hitType: string,
  fieldsObject?: string | object
): void;
